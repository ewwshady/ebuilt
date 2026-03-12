import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import type { Product } from "@/lib/schemas"
import { ObjectId } from "mongodb"

// GET all products for a tenant
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized - No valid session" }, { status: 401 })
    }

    if (!ObjectId.isValid(session.tenantId)) {
      return NextResponse.json({ error: "Invalid tenant ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const products = await db
      .collection<Product>("products")
      .find({ tenantId: new ObjectId(session.tenantId) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch products" },
      { status: 500 },
    )
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized - No valid session" }, { status: 401 })
    }

    if (session.role !== "tenant_admin") {
      return NextResponse.json({ error: "Forbidden - Only tenant admins can create products" }, { status: 403 })
    }

    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { name, slug, description, price, compareAtPrice, images, category, tags, inventory, status } = body

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 })
    }

    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json({ error: "Product slug is required" }, { status: 400 })
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ error: "Slug must be lowercase, alphanumeric with hyphens only" }, { status: 400 })
    }

    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 })
    }

    if (compareAtPrice !== undefined && compareAtPrice !== null) {
      const comparePrice = Number(compareAtPrice)
      if (isNaN(comparePrice) || comparePrice < Number(price)) {
        return NextResponse.json({ error: "Compare at price must be greater than regular price" }, { status: 400 })
      }
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    // Check if slug already exists for this tenant
    const existing = await db.collection<Product>("products").findOne({
      slug,
      tenantId: new ObjectId(session.tenantId),
    })

    if (existing) {
      return NextResponse.json({ error: "Product slug already exists" }, { status: 409 })
    }

    const sanitizedInventory = {
      sku: inventory?.sku || "",
      quantity: Math.max(0, Number.parseInt(inventory?.quantity) || 0),
      trackInventory: Boolean(inventory?.trackInventory),
    }

    const product: Product = {
      tenantId: new ObjectId(session.tenantId),
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim() || "",
      price: Number.parseFloat(price),
      compareAtPrice: compareAtPrice ? Number.parseFloat(compareAtPrice) : undefined,
      images: Array.isArray(images) ? images.filter((img) => typeof img === "string") : [],
      category: category?.trim() || "Uncategorized",
      tags: Array.isArray(tags) ? tags.filter((tag) => typeof tag === "string") : [],
      inventory: sanitizedInventory,
      seo: {},
      status: ["draft", "active", "archived"].includes(status) ? status : "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Product>("products").insertOne(product)

    return NextResponse.json({ product: { ...product, _id: result.insertedId } }, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 },
    )
  }
}
