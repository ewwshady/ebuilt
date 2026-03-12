import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getTenantFromSubdomainHeader, validateTenantMatch } from "@/lib/tenant-admin"
import { getAdminSession } from "@/lib/admin-auth"
import { ObjectId } from "mongodb"
import type { User } from "@/lib/schemas"

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
    const search = url.searchParams.get("search") || ""

    const client = await clientPromise
    const db = client.db("ebuilt")

    const query: any = { 
      tenantId: new ObjectId(session.tenantId),
      role: "customer"
    }
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ]
    }

    const total = await db.collection<User>("users").countDocuments(query)
    const customers = await db
      .collection<User>("users")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const serialized = customers.map((c) => ({
      ...c,
      _id: c._id?.toString(),
      tenantId: c.tenantId?.toString(),
      createdAt: c.createdAt?.toISOString?.() || new Date().toISOString(),
      updatedAt: c.updatedAt?.toISOString?.() || new Date().toISOString(),
    }))

    return NextResponse.json({
      customers: serialized,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[customers GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
