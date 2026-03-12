import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { getDb } from "@/lib/mongodb"
import { prepareEsewaPayment } from "@/lib/payments/esewa-service"
import { ObjectId } from "mongodb"

export async function POST(req: Request) {
  try {
    const { amount, orderId, tenantId } = await req.json()

    if (!amount || !orderId || !tenantId) {
      return NextResponse.json(
        { error: "Missing amount, orderId, or tenantId" },
        { status: 400 }
      )
    }

    // Verify order exists and matches tenant
    const db = await getDb()
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(orderId),
      tenantId: new ObjectId(tenantId),
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const headerList = await headers()
    const host = headerList.get("host")
    const protocol = host?.includes("localhost") ? "http" : "https"
    const baseUrl = `${protocol}://${host}`

    // Prepare payment with tenant's eSewa config
    const paymentData = await prepareEsewaPayment(tenantId, orderId, amount, baseUrl)

    if (!paymentData) {
      return NextResponse.json(
        { error: "Payment gateway not configured for this store" },
        { status: 400 }
      )
    }

    return NextResponse.json(paymentData)
  } catch (error) {
    console.error("[eSewa initiate error]", error)
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 })
  }
}
