import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getTenantFromSubdomainHeader, validateTenantMatch } from "@/lib/tenant-admin"
import { getAdminSession } from "@/lib/admin-auth"
import { ObjectId } from "mongodb"
import type { Order } from "@/lib/schemas"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant || !validateTenantMatch(session.tenantId, tenant._id!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params

    const client = await clientPromise
    const db = client.db("ebuilt")

    const order = await db.collection<Order>("orders").findOne({
      _id: new ObjectId(id),
      tenantId: new ObjectId(session.tenantId),
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      order: {
        ...order,
        _id: order._id?.toString(),
        tenantId: order.tenantId.toString(),
        customerId: order.customerId.toString(),
        items: order.items.map((item) => ({
          ...item,
          productId: item.productId.toString(),
        })),
        createdAt: order.createdAt?.toISOString(),
        updatedAt: order.updatedAt?.toISOString(),
      },
    })
  } catch (error) {
    console.error("[order GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant || !validateTenantMatch(session.tenantId, tenant._id!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const client = await clientPromise
    const db = client.db("ebuilt")

    const result = await db.collection<Order>("orders").findOneAndUpdate(
      {
        _id: new ObjectId(id),
        tenantId: new ObjectId(session.tenantId),
      },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    )

    if (!result.value) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      order: {
        ...result.value,
        _id: result.value._id?.toString(),
        tenantId: result.value.tenantId.toString(),
        customerId: result.value.customerId.toString(),
        items: result.value.items.map((item) => ({
          ...item,
          productId: item.productId.toString(),
        })),
        createdAt: result.value.createdAt?.toISOString(),
        updatedAt: result.value.updatedAt?.toISOString(),
      },
    })
  } catch (error) {
    console.error("[order PUT] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
