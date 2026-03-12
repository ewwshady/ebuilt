// app/api/orders/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    const session = await verifyToken(token)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Invalid or expired token" }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { tenantId, items, shippingAddress, paymentMethod } = body

    if (!tenantId || typeof tenantId !== "string") {
      return NextResponse.json({ error: "Missing or invalid tenantId" }, { status: 400 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty or invalid items" }, { status: 400 })
    }

    if (!shippingAddress || typeof shippingAddress !== "object") {
      return NextResponse.json({ error: "Missing shipping address" }, { status: 400 })
    }

    const requiredAddressFields = ["name", "address", "city", "state", "zip", "country"]
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field] || typeof shippingAddress[field] !== "string") {
        return NextResponse.json({ error: `Missing or invalid ${field} in shipping address` }, { status: 400 })
      }
    }

    if (!paymentMethod || typeof paymentMethod !== "string") {
      return NextResponse.json({ error: "Missing or invalid payment method" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    if (!ObjectId.isValid(tenantId)) {
      return NextResponse.json({ error: "Invalid tenant ID format" }, { status: 400 })
    }

    // Get tenant for tax rate
    const tenant = await db.collection("tenants").findOne({ _id: new ObjectId(tenantId) })
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    if (tenant.status !== "active") {
      return NextResponse.json({ error: "Store is not active" }, { status: 403 })
    }

    // Get user info
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const validatedItems = []
    for (const item of items) {
      if (!item.productId || !ObjectId.isValid(item.productId)) {
        return NextResponse.json({ error: "Invalid product ID in cart" }, { status: 400 })
      }

      const product = await db.collection("products").findOne({
        _id: new ObjectId(item.productId),
        tenantId: new ObjectId(tenantId),
      })

      if (!product) {
        return NextResponse.json({ error: `Product ${item.name || "unknown"} not found` }, { status: 404 })
      }

      if (product.status !== "active") {
        return NextResponse.json({ error: `Product ${product.name} is not available` }, { status: 400 })
      }

      if (product.inventory?.trackInventory) {
        if (product.inventory.quantity < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${product.name}. Only ${product.inventory.quantity} available.` },
            { status: 400 },
          )
        }
      }

      const quantity = Number.parseInt(item.quantity)
      if (isNaN(quantity) || quantity < 1) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
      }

      validatedItems.push({
        productId: new ObjectId(item.productId),
        name: product.name,
        price: product.price,
        quantity: quantity,
        total: product.price * quantity,
      })
    }

    // Calculate totals
    const subtotal = validatedItems.reduce((sum, item) => sum + item.total, 0)
    const taxRate = tenant.settings?.taxRate || 0
    const tax = subtotal * (taxRate / 100)
    const total = subtotal + tax

    if (tenant.paymentSettings) {
      const paymentConfig = tenant.paymentSettings[paymentMethod as keyof typeof tenant.paymentSettings]
      if (!paymentConfig || !paymentConfig.enabled) {
        return NextResponse.json({ error: "Selected payment method is not available" }, { status: 400 })
      }
    }

    // Generate order number
    const orderCount = await db.collection("orders").countDocuments({ tenantId: new ObjectId(tenantId) })
    const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`

    const order = {
      tenantId: new ObjectId(tenantId),
      orderNumber,
      customerId: new ObjectId(session.userId),
      customerEmail: user.email,
      items: validatedItems,
      subtotal,
      tax,
      total,
      status: "pending",
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      paymentMethod,
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mongoSession = client.startSession()
    try {
      await mongoSession.withTransaction(async () => {
        const result = await db.collection("orders").insertOne(order, { session: mongoSession })

        // Update product inventory
        for (const item of validatedItems) {
          await db.collection("products").updateOne(
            { _id: item.productId, "inventory.trackInventory": true },
            {
              $inc: { "inventory.quantity": -item.quantity },
            },
            { session: mongoSession },
          )
        }

        order._id = result.insertedId
      })
    } finally {
      await mongoSession.endSession()
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    const session = await verifyToken(token)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Invalid or expired token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId")

    const client = await clientPromise
    const db = client.db("ebuilt")

    const filter: any = {}

    if (session.role === "tenant_admin") {
      if (!tenantId) {
        return NextResponse.json({ error: "Tenant ID required for tenant admin" }, { status: 400 })
      }
      if (!ObjectId.isValid(tenantId)) {
        return NextResponse.json({ error: "Invalid tenant ID format" }, { status: 400 })
      }
      filter.tenantId = new ObjectId(tenantId)
    } else if (session.role === "customer") {
      filter.customerId = new ObjectId(session.userId)
    } else if (session.role === "super_admin") {
      // Super admin can see all orders
      if (tenantId && ObjectId.isValid(tenantId)) {
        filter.tenantId = new ObjectId(tenantId)
      }
    }

    const orders = await db.collection("orders").find(filter).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Fetch orders error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
