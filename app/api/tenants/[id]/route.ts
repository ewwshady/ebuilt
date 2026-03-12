import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"
import type { Tenant } from "@/lib/schemas"

// GET single tenant
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const tenant = await db.collection<Tenant>("tenants").findOne({ _id: new ObjectId(id) })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Check authorization
    if (session.role !== "super_admin" && session.tenantId !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ tenant })
  } catch (error) {
    console.error("Get tenant error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH update tenant
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check authorization
    if (session.role !== "super_admin" && session.tenantId !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const client = await clientPromise
    const db = client.db("ebuilt")

    const updateData: Partial<Tenant> = {
      ...body,
      updatedAt: new Date(),
    }

    // Remove fields that shouldn't be updated
    delete (updateData as any)._id
    delete (updateData as any).ownerId
    delete (updateData as any).createdAt

    // Super admin can change subdomain, tenant admin cannot
    if (session.role !== "super_admin") {
      delete updateData.subdomain
      delete updateData.status
      delete updateData.plan
    }

    await db.collection<Tenant>("tenants").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    const updatedTenant = await db.collection<Tenant>("tenants").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ tenant: updatedTenant })
  } catch (error) {
    console.error("Update tenant error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE tenant (super admin only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    const { id } = await params

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    await db.collection<Tenant>("tenants").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete tenant error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
