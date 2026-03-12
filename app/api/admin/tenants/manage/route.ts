import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    // Verify super admin
    const session = await getSession()
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (status) {
      query.status = status
    }

    // Get tenants
    const tenants = await db
      .collection("tenants")
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray()

    const total = await db.collection("tenants").countDocuments(query)

    // Format response
    const formatted = tenants.map((tenant: any) => ({
      id: tenant._id?.toString(),
      name: tenant.name,
      subdomain: tenant.subdomain,
      category: tenant.category,
      status: tenant.status,
      plan: tenant.plan,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    }))

    return NextResponse.json({
      tenants: formatted,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[get tenants]", error)
    return NextResponse.json({ error: "Failed to fetch tenants" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    // Verify super admin
    const session = await getSession()
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tenantId, status, plan } = body

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const db = await getDb()

    // Validate status
    if (status && !["active", "inactive", "suspended"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Validate plan
    if (plan && !["basic", "premium", "enterprise"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // Build update
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    if (status) updateData.status = status
    if (plan) updateData.plan = plan

    // Update tenant
    const result = await db.collection("tenants").updateOne(
      { _id: new ObjectId(tenantId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Tenant updated successfully",
      tenantId,
      updates: updateData,
    })
  } catch (error) {
    console.error("[update tenant]", error)
    return NextResponse.json({ error: "Failed to update tenant" }, { status: 500 })
  }
}
