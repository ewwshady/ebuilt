import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"
import { ObjectId } from "mongodb"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()
    const { status, tracking } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const db = await getDb()

    // Get order
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(id),
      tenantId: new ObjectId(tenant._id!),
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Prepare update
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    // Add tracking info if provided
    if (tracking) {
      if (status === "shipped") {
        if (!tracking.carrier || !tracking.trackingNumber) {
          return NextResponse.json(
            { error: "Carrier and tracking number required for shipped status" },
            { status: 400 }
          )
        }
        updateData.tracking = {
          carrier: tracking.carrier,
          trackingNumber: tracking.trackingNumber,
          estimatedDelivery: tracking.estimatedDelivery
            ? new Date(tracking.estimatedDelivery)
            : undefined,
        }
      }
    }

    // Update order
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Order status updated successfully",
      status,
      tracking: updateData.tracking,
    })
  } catch (error) {
    console.error("[update order status]", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
