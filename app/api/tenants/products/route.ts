import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getTenantFromSubdomainHeader, validateTenantMatch } from "@/lib/tenant-admin"
import { getAdminSession } from "@/lib/admin-auth"
import { ObjectId } from "mongodb"
import type { Product } from "@/lib/schemas"

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant || !validateTenantMatch(session.tenantId, tenant._id!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const search = url.searchParams.get("search") || ""
    const status = url.searchParams.get("status") || ""

    const db = await getDb()
    const query: any = { tenantId: new ObjectId(session.tenantId) }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "inventory.sku": { $regex: search, $options: "i" } }
      ]
    }

    if (status && status !== "all") {
      query.status = status
    }

    const total = await db.collection<Product>("products").countDocuments(query)
    const products = await db
      .collection<Product>("products")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const serialized = products.map((p) => ({
      ...p,
      _id: p._id?.toString(),
      tenantId: p.tenantId.toString(),
      collections: p.collections?.map(c => c.toString()) || [],
      // FIX: Wrap in new Date() to ensure toISOString() works regardless of DB format
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
    }))

    return NextResponse.json({
      products: serialized,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("[products GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant || !validateTenantMatch(session.tenantId, tenant._id!)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { 
      name, description, price, compareAtPrice, costPrice,
      images, category, collections, tags, vendor,
      inventory, seo, status, isPhysical, weight, weightUnit, isTaxable 
    } = body

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 })
    }

    // Validating and cleaning IDs to prevent BSONError
    const validCollectionIds = (collections || [])
      .map((id: string) => id.trim())
      .filter((id: string) => id.length === 24 && ObjectId.isValid(id))
      .map((id: string) => new ObjectId(id))

    const slug = name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
    const db = await getDb()

    const product: any = {
      tenantId: new ObjectId(session.tenantId),
      name,
      slug,
      description: description || "",
      price: parseFloat(price) || 0,
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      costPrice: costPrice ? parseFloat(costPrice) : undefined,
      images: (images || []).filter((img: any) => img.url),
      category: category || "Uncategorized",
      collections: validCollectionIds,
      tags: (tags || []).map((t: string) => t.trim()).filter((t: string) => t !== ""),
      vendor: vendor || "",
      isPhysical: isPhysical ?? true,
      weight: weight ? parseFloat(weight) : 0,
      weightUnit: weightUnit || "kg",
      isTaxable: isTaxable ?? true,
      inventory: {
        sku: inventory?.sku || "",
        quantity: parseInt(inventory?.quantity || "0"),
        trackInventory: inventory?.trackInventory ?? true,
        lowStockThreshold: parseInt(inventory?.lowStockThreshold || "5"),
      },
      seo: {
        title: seo?.title || name,
        description: seo?.description || description?.slice(0, 160) || "",
        keywords: seo?.keywords || [],
      },
      status: status || "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("products").insertOne(product)
    return NextResponse.json({ success: true, product: { ...product, _id: result.insertedId.toString() } }, { status: 201 })
  } catch (error) {
    console.error("[products POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
