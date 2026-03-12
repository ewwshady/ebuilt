import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getTenantFromSubdomainHeader, validateTenantMatch } from "@/lib/tenant-admin"
import { getAdminSession } from "@/lib/admin-auth"
import { ObjectId } from "mongodb"
import type { Order } from "@/lib/schemas"

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

    const total = await db.collection<Order>("orders").countDocuments(query)
    const orders = await db
      .collection<Order>("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const serialized = orders.map((o) => ({
      ...o,
      _id: o._id?.toString(),
      tenantId: o.tenantId.toString(),
      customerId: o.customerId.toString(),
      items: o.items.map((item) => ({
        ...item,
        productId: item.productId.toString(),
      })),
      createdAt: o.createdAt?.toISOString(),
      updatedAt: o.updatedAt?.toISOString(),
    }))

    return NextResponse.json({
      orders: serialized,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[orders GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
