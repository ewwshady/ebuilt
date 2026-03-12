import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getTenantFromSubdomainHeader, validateTenantMatch } from "@/lib/tenant-admin"
import { getAdminSession } from "@/lib/admin-auth"
import { ObjectId } from "mongodb"
import type { Review } from "@/lib/schemas"

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

    const result = await db.collection<Review>("reviews").findOneAndUpdate(
      {
        _id: new ObjectId(id),
        tenantId: new ObjectId(session.tenantId),
      },
      {
        $set: {
          status: body.status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    )

    if (!result.value) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      review: {
        ...result.value,
        _id: result.value._id?.toString(),
        tenantId: result.value.tenantId.toString(),
        productId: result.value.productId.toString(),
        customerId: result.value.customerId.toString(),
        createdAt: result.value.createdAt?.toISOString(),
        updatedAt: result.value.updatedAt?.toISOString(),
      },
    })
  } catch (error) {
    console.error("[review PUT] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
