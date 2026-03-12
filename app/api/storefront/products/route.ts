import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Product } from "@/lib/schemas"
import type { ObjectId } from "mongodb"

// GET all active products for a tenant with filtering and pagination (public)
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

    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category") || undefined
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined
    const inStock = searchParams.get("inStock") === "true"
    const sortBy = searchParams.get("sort") || "createdAt" // createdAt, price, name, rating
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const skip = (page - 1) * limit

    // Build filter query
    const filterQuery: any = {
      tenantId: tenant._id as ObjectId,
      status: "active",
    }

    // Category filter
    if (category) {
      filterQuery.category = category
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filterQuery.price = {}
      if (minPrice !== undefined) filterQuery.price.$gte = minPrice
      if (maxPrice !== undefined) filterQuery.price.$lte = maxPrice
    }

    // In stock filter
    if (inStock) {
      filterQuery["inventory.quantity"] = { $gt: 0 }
    }

    // Build sort object
    let sortObj: any = { createdAt: -1 }
    switch (sortBy) {
      case "price-asc":
        sortObj = { price: 1 }
        break
      case "price-desc":
        sortObj = { price: -1 }
        break
      case "name":
        sortObj = { name: 1 }
        break
      case "rating":
        sortObj = { "rating.average": -1 }
        break
      case "newest":
        sortObj = { createdAt: -1 }
        break
    }

    // Get products with filtering and pagination
    const products = await db
      .collection<Product>("products")
      .find(filterQuery)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count for pagination
    const total = await db
      .collection<Product>("products")
      .countDocuments(filterQuery)

    // Serialize products
    const serialized = products.map((p: any) => ({
      ...p,
      _id: p._id?.toString(),
      tenantId: p.tenantId?.toString(),
      image: Array.isArray(p.images) && p.images.length > 0
        ? typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url
        : "",
    }))

    return NextResponse.json({
      products: serialized,
      pagination: {
        total,
        page,
        limit,
        hasMore: skip + limit < total,
      },
      filters: {
        category,
        minPrice,
        maxPrice,
        inStock,
        sortBy,
      },
    })
  } catch (error) {
    console.error("Get storefront products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
