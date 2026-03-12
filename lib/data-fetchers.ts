// lib/data-fetchers.ts (Updated)

import { getDb } from "./mongodb"
import { ObjectId } from "mongodb"
import type { Product, Tenant, User } from "./schemas"

export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  try {
    const db = await getDb()
    const tenant = await db.collection<Tenant>("tenants").findOne({ _id: new ObjectId(tenantId) })
    return tenant
  } catch (error) {
    console.error("[CK] Error fetching tenant:", error)
    return null
  }
}

export async function getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
  try {
    const db = await getDb()
    const tenant = await db.collection<Tenant>("tenants").findOne({ subdomain })
    return tenant
  } catch (error) {
    console.error("[CK] Error fetching tenant:", error)
    return null
  }
}

export async function getProductsByTenant(tenantId: string, category?: string, limit = 8): Promise<Product[]> {
  try {
    const db = await getDb()
    const filter: any = {
      tenantId: new ObjectId(tenantId),
      status: "active",
    }
    if (category && category !== "All") {
      filter.category = category
    }
    const products = await db.collection<Product>("products").find(filter).limit(limit).toArray()
    return products
  } catch (error) {
    console.error("[CK] Error fetching products:", error)
    return []
  }
}

export async function getTopProductsByTenant(tenantId: string, limit = 8): Promise<Product[]> {
  try {
    const db = await getDb()
    const products = await db
      .collection<Product>("products")
      .find({
        tenantId: new ObjectId(tenantId),
        status: "active",
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
    return products
  } catch (error) {
    console.error("[CK] Error fetching top products:", error)
    return []
  }
}

export async function getCategoriesByTenant(tenantId: string): Promise<{ name: string; count: number }[]> {
  try {
    const db = await getDb()
    const categories = await db
      .collection<Product>("products")
      .aggregate([
        { $match: { tenantId: new ObjectId(tenantId), status: "active" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { name: "$_id", count: 1, _id: 0 } },
        { $sort: { name: 1 } },
      ])
      .toArray()
    return categories as { name: string; count: number }[]
  } catch (error) {
    console.error("[CK] Error fetching categories:", error)
    return []
  }
}

export async function getProductById(productId: string, tenantId: string): Promise<Product | null> {
  try {
    const db = await getDb()
    const product = await db.collection<Product>("products").findOne({
      _id: new ObjectId(productId),
      tenantId: new ObjectId(tenantId),
      status: "active",
    })
    return product
  } catch (error) {
    console.error("[CK] Error fetching product:", error)
    return null
  }
}

export async function getProductBySlug(slug: string, tenantId: string): Promise<Product | null> {
  try {
    const db = await getDb()
    const product = await db.collection<Product>("products").findOne({
      slug,
      tenantId: new ObjectId(tenantId),
      status: "active",
    })
    return product
  } catch (error) {
    console.error("[CK] Error fetching product by slug:", error)
    return null
  }
}

export async function getTenantOwner(ownerId: string): Promise<User | null> {
  try {
    const db = await getDb()
    const owner = await db.collection<User>("users").findOne({ _id: new ObjectId(ownerId) })
    return owner
  } catch (error) {
    console.error("[CK] Error fetching tenant owner:", error)
    return null
  }
}
