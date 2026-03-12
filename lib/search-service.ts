import { Db, ObjectId } from "mongodb"
import type { Product } from "./schemas"

export interface SearchOptions {
  query: string
  tenantId: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  limit?: number
  skip?: number
}

export interface SearchResult {
  products: any[]
  total: number
  hasMore: boolean
}

/**
 * Initialize text index for full-text search
 * Call this once when setting up the database
 */
export async function initializeSearchIndex(db: Db) {
  try {
    await db.collection("products").createIndex({
      name: "text",
      description: "text",
      category: "text",
      tags: "text",
    })
    console.log("[Search] Text index created successfully")
  } catch (error) {
    console.error("[Search] Index creation error:", error)
    // Index might already exist, which is fine
  }
}

/**
 * Search products with optional filters
 */
export async function searchProducts(
  db: Db,
  options: SearchOptions
): Promise<SearchResult> {
  try {
    const {
      query,
      tenantId,
      category,
      minPrice,
      maxPrice,
      inStock,
      limit = 20,
      skip = 0,
    } = options

    // Build search query
    const searchQuery: any = {
      tenantId: new ObjectId(tenantId),
      status: "active",
    }

    // Text search on query
    if (query && query.trim()) {
      searchQuery.$text = { $search: query }
    }

    // Category filter
    if (category) {
      searchQuery.category = category
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      searchQuery.price = {}
      if (minPrice !== undefined) searchQuery.price.$gte = minPrice
      if (maxPrice !== undefined) searchQuery.price.$lte = maxPrice
    }

    // In stock filter
    if (inStock) {
      searchQuery["inventory.quantity"] = { $gt: 0 }
    }

    // Execute search
    const products = await db
      .collection<Product>("products")
      .find(searchQuery)
      .sort(query ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count (without limit/skip)
    const total = await db.collection<Product>("products").countDocuments(searchQuery)

    // Serialize products
    const serialized = products.map((p: any) => ({
      ...p,
      _id: p._id?.toString(),
      tenantId: p.tenantId?.toString(),
      image: Array.isArray(p.images) && p.images.length > 0
        ? typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url
        : "",
    }))

    return {
      products: serialized,
      total,
      hasMore: skip + limit < total,
    }
  } catch (error) {
    console.error("[Search] Error:", error)
    return {
      products: [],
      total: 0,
      hasMore: false,
    }
  }
}

/**
 * Autocomplete suggestions for search
 */
export async function getSearchSuggestions(
  db: Db,
  query: string,
  tenantId: string,
  limit: number = 5
): Promise<string[]> {
  try {
    if (!query || query.length < 2) return []

    const suggestions = await db
      .collection("products")
      .aggregate([
        {
          $match: {
            tenantId: new ObjectId(tenantId),
            status: "active",
            name: { $regex: query, $options: "i" },
          },
        },
        {
          $group: {
            _id: "$name",
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $limit: limit,
        },
        {
          $project: {
            name: "$_id",
            _id: 0,
          },
        },
      ])
      .toArray()

    return suggestions.map((s: any) => s.name)
  } catch (error) {
    console.error("[Search Suggestions] Error:", error)
    return []
  }
}

/**
 * Get popular search queries for analytics
 */
export async function getPopularSearches(
  db: Db,
  tenantId: string,
  limit: number = 10
): Promise<{ query: string; count: number }[]> {
  try {
    const popular = await db
      .collection("searchLogs")
      .aggregate([
        {
          $match: {
            tenantId: new ObjectId(tenantId),
            createdAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
        {
          $group: {
            _id: "$query",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: limit,
        },
      ])
      .toArray()

    return popular.map((p: any) => ({
      query: p._id,
      count: p.count,
    }))
  } catch (error) {
    console.error("[Popular Searches] Error:", error)
    return []
  }
}

/**
 * Log search query for analytics (call this after every search)
 */
export async function logSearchQuery(
  db: Db,
  tenantId: string,
  query: string,
  resultsCount: number
) {
  try {
    if (!query || query.trim().length < 2) return

    await db.collection("searchLogs").insertOne({
      tenantId: new ObjectId(tenantId),
      query: query.trim(),
      resultsCount,
      createdAt: new Date(),
    })
  } catch (error) {
    console.error("[Log Search] Error:", error)
  }
}
