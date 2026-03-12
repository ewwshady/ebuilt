import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/session"

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDb()
    const filter: any = {}

    if (session.role === "customer") {
      filter.customerId = new ObjectId(session.userId)
      filter.tenantId = new ObjectId(session.tenantId)
    } else if (session.role === "tenant_admin") {
      filter.tenantId = new ObjectId(session.tenantId)
    }

    const orders = await db.collection("orders")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    const serialized = orders.map(o => ({
      ...o,
      _id: o._id.toString(),
      customerId: o.customerId.toString(),
      tenantId: o.tenantId.toString(),
      createdAt: new Date(o.createdAt).toISOString()
    }))

    return NextResponse.json({ orders: serialized })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
