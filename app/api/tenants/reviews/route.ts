import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getTenantFromSubdomainHeader, validateTenantMatch } from "@/lib/tenant-admin"
import { getAdminSession } from "@/lib/admin-auth"
import { ObjectId } from "mongodb"
import type { Review } from "@/lib/schemas"

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant || !validateTenantMatch(session.tenantId, tenant._id!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const status = url.searchParams.get("status") || ""

    const client = await clientPromise
    const db = client.db("ebuilt")

    const query: any = { tenantId: new ObjectId(session.tenantId) }
    if (status) {
      query.status = status
    }

    const total = await db.collection<Review>("reviews").countDocuments(query)
    const reviews = await db
      .collection<Review>("reviews")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const serialized = reviews.map((r) => ({
      ...r,
      _id: r._id?.toString(),
      tenantId: r.tenantId.toString(),
      productId: r.productId.toString(),
      customerId: r.customerId.toString(),
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    }))

    return NextResponse.json({
      reviews: serialized,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[reviews GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
