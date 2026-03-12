import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { searchProducts, logSearchQuery } from "@/lib/search-service"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"

export async function GET(request: NextRequest) {
  try {
    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const category = searchParams.get("category") || undefined
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined
    const inStock = searchParams.get("inStock") === "true"
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const skip = (page - 1) * limit

    if (!query.trim()) {
      return NextResponse.json({
        error: "Search query is required",
        products: [],
        total: 0,
        page,
        hasMore: false,
      }, { status: 400 })
    }

    const db = await getDb()
    const result = await searchProducts(db, {
      query,
      tenantId: tenant._id!.toString(),
      category,
      minPrice,
      maxPrice,
      inStock,
      limit,
      skip,
    })

    // Log search for analytics
    await logSearchQuery(db, tenant._id!.toString(), query, result.total)

    return NextResponse.json({
      products: result.products,
      total: result.total,
      page,
      limit,
      hasMore: result.hasMore,
      query,
    })
  } catch (error) {
    console.error("[Search API] Error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
