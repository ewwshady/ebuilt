import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Product } from "@/lib/schemas"
import type { ObjectId } from "mongodb"

// GET single product by slug (public)
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const tenantSubdomain = request.headers.get("x-tenant-subdomain")
    const { slug } = await params

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

    // Get product by slug for this tenant
    const product = await db.collection<Product>("products").findOne({
      tenantId: tenant._id as ObjectId,
      slug,
      status: "active",
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Get storefront product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
