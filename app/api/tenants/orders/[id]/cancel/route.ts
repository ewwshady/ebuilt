import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"
import { restoreInventory } from "@/lib/inventory-service"
import { ObjectId } from "mongodb"

interface RouteParams {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify admin session
    const session = await getSession()
    if (!session || session.role !== "tenant_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get tenant from subdomain
    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant || tenant._id?.toString() !== session.tenantId) {
      return NextResponse.json({ error: "Tenant mismatch" }, { status: 403 })
    }

    const orderId = new ObjectId(params.id)
    const db = await getDb()

    // Get order
    const order = await db.collection("orders").findOne({
      _id: orderId,
      tenantId: new ObjectId(tenant._id),
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Can only cancel pending or processing orders
    if (!["pending", "processing"].includes(order.status)) {
      return NextResponse.json(
        { error: `Cannot cancel order with status "${order.status}"` },
        { status: 400 }
      )
    }

    // Restore inventory
    const inventoryItems = order.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))

    const inventoryResult = await restoreInventory(
      db,
      new ObjectId(tenant._id),
      inventoryItems,
      orderId
    )

    if (!inventoryResult.success) {
      return NextResponse.json(
        { error: "Failed to restore inventory: " + inventoryResult.errors.join(", ") },
        { status: 400 }
      )
    }

    // Update order status
    await db.collection("orders").updateOne(
      { _id: orderId },
      {
        $set: {
          status: "cancelled",
          paymentStatus: order.paymentStatus === "paid" ? "refunded" : "cancelled",
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({
      message: "Order cancelled successfully and inventory restored",
      order: {
        id: orderId.toString(),
        status: "cancelled",
        inventoryRestored: inventoryResult.success,
      },
    })
  } catch (error) {
    console.error("[Order Cancellation] Error:", error)
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}
