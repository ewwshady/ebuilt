import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { verifyEsewaPayment } from "@/lib/payments/esewa-service"
import { ObjectId } from "mongodb"

export async function POST(req: Request) {
  try {
    const { orderId, tenantId, transactionUuid, status } = await req.json()

    if (!orderId || !tenantId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()

    // Get order
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(orderId),
      tenantId: new ObjectId(tenantId),
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Verify payment
    const verification = await verifyEsewaPayment(tenantId, transactionUuid || "", status)

    if (!verification.valid) {
      await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            paymentStatus: "failed",
            updatedAt: new Date(),
          },
        }
      )

      return NextResponse.json(
        { success: false, message: verification.message },
        { status: 400 }
      )
    }

    // Update order status
    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentStatus: "paid",
          paymentId: transactionUuid,
          status: "processing",
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ success: true, message: "Payment verified successfully" })
  } catch (error) {
    console.error("[eSewa verify error]", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
