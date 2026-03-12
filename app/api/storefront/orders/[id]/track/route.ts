import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get customer session
    const session = await getSession()
    if (!session || session.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const db = await getDb()

    // Get order - ensure customer owns the order
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(id),
      customerId: new ObjectId(session.userId),
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Prepare tracking timeline
    const timeline = generateTrackingTimeline(order)

    return NextResponse.json({
      order: {
        id: order._id?.toString(),
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        currency: order.currency || "Rs.",
        createdAt: order.createdAt,
        items: order.items,
      },
      tracking: {
        carrier: order.tracking?.carrier,
        trackingNumber: order.tracking?.trackingNumber,
        estimatedDelivery: order.tracking?.estimatedDelivery,
        timeline,
      },
      shippingAddress: order.shippingAddress,
    })
  } catch (error) {
    console.error("[order tracking]", error)
    return NextResponse.json({ error: "Failed to fetch order tracking" }, { status: 500 })
  }
}

function generateTrackingTimeline(order: any): Array<{
  status: string
  timestamp: Date | null
  completed: boolean
  description: string
}> {
  const statuses = [
    { status: "pending", description: "Order Placed" },
    { status: "processing", description: "Processing Order" },
    { status: "shipped", description: "Shipped" },
    { status: "delivered", description: "Delivered" },
  ]

  return statuses.map((item) => {
    const isCompleted = order.status === item.status || 
      (order.status === "delivered" && item.status !== "pending")

    return {
      status: item.status,
      timestamp: order.createdAt, // In real scenario, track actual status change times
      completed: isCompleted,
      description: item.description,
    }
  })
}
