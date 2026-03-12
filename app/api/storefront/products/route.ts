import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Product } from "@/lib/schemas"
import type { ObjectId } from "mongodb"

// GET all active products for a tenant (public)
export async function GET(request: NextRequest) {
  try {
    const tenantSubdomain = request.headers.get("x-tenant-subdomain")

    if (!tenantSubdomain) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    // Get tenant by subdomain
    const tenant = await db.collection("tenants").findOne({ subdomain: tenantSubdomain })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get active products for this tenant
    const products = await db
      .collection<Product>("products")
      .find({
        tenantId: tenant._id as ObjectId,
        status: "active",
      })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Get storefront products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
