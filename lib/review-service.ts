import { getDb } from "./mongodb"
import { ObjectId } from "mongodb"
import type { Review, Order } from "./schemas"

/**
 * Check if a customer has purchased a product
 */
export async function hasPurchasedProduct(
  customerId: string,
  productId: string,
  tenantId: string
): Promise<boolean> {
  const db = await getDb()

  const purchasedOrder = await db.collection<Order>("orders").findOne({
    customerId: new ObjectId(customerId),
    tenantId: new ObjectId(tenantId),
    paymentStatus: "paid",
    items: {
      $elemMatch: {
        productId: new ObjectId(productId),
      },
    },
  })

  return !!purchasedOrder
}

/**
 * Get customer's purchase history for a product
 */
export async function getProductPurchaseHistory(
  customerId: string,
  productId: string,
  tenantId: string
): Promise<Order | null> {
  const db = await getDb()

  const order = await db.collection<Order>("orders").findOne({
    customerId: new ObjectId(customerId),
    tenantId: new ObjectId(tenantId),
    paymentStatus: "paid",
    items: {
      $elemMatch: {
        productId: new ObjectId(productId),
      },
    },
  })

  return order || null
}

/**
 * Create a review with purchase verification
 */
export async function createReview(
  customerId: string,
  productId: string,
  tenantId: string,
  reviewData: {
    customerName: string
    customerEmail: string
    title: string
    comment: string
    rating: number
  }
): Promise<{ success: boolean; message: string; reviewId?: string }> {
  const db = await getDb()

  // Verify purchase
  const hasPurchased = await hasPurchasedProduct(customerId, productId, tenantId)

  if (!hasPurchased) {
    return { success: false, message: "You can only review products you have purchased" }
  }

  // Check if customer already reviewed this product
  const existingReview = await db.collection<Review>("reviews").findOne({
    customerId: new ObjectId(customerId),
    productId: new ObjectId(productId),
    tenantId: new ObjectId(tenantId),
    status: { $in: ["approved", "pending"] },
  })

  if (existingReview) {
    return { success: false, message: "You have already reviewed this product" }
  }

  // Validate rating
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    return { success: false, message: "Rating must be between 1 and 5" }
  }

  // Validate content
  if (!reviewData.title || reviewData.title.trim().length < 3) {
    return { success: false, message: "Title must be at least 3 characters" }
  }

  if (!reviewData.comment || reviewData.comment.trim().length < 10) {
    return { success: false, message: "Comment must be at least 10 characters" }
  }

  // Create review
  const review: Review = {
    tenantId: new ObjectId(tenantId),
    productId: new ObjectId(productId),
    customerId: new ObjectId(customerId),
    customerName: reviewData.customerName || "Anonymous",
    customerEmail: reviewData.customerEmail,
    rating: reviewData.rating,
    title: reviewData.title.trim(),
    comment: reviewData.comment.trim(),
    status: "pending", // Requires approval
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection<Review>("reviews").insertOne(review)

  return {
    success: true,
    message: "Review submitted successfully. It will be visible after approval.",
    reviewId: result.insertedId.toString(),
  }
}

/**
 * Get product reviews with ratings
 */
export async function getProductReviews(
  productId: string,
  tenantId: string,
  onlyApproved = true
): Promise<Array<Review & { _id: ObjectId }>> {
  const db = await getDb()

  const query: any = {
    productId: new ObjectId(productId),
    tenantId: new ObjectId(tenantId),
  }

  if (onlyApproved) {
    query.status = "approved"
  }

  const reviews = await db.collection<Review>("reviews").find(query).sort({ createdAt: -1 }).toArray()

  return reviews
}

/**
 * Get average rating for a product
 */
export async function getProductAverageRating(
  productId: string,
  tenantId: string
): Promise<{ averageRating: number; totalReviews: number }> {
  const db = await getDb()

  const result = await db
    .collection<Review>("reviews")
    .aggregate([
      {
        $match: {
          productId: new ObjectId(productId),
          tenantId: new ObjectId(tenantId),
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ])
    .toArray()

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0 }
  }

  return {
    averageRating: parseFloat(result[0].averageRating.toFixed(1)),
    totalReviews: result[0].totalReviews,
  }
}

/**
 * Get rating distribution for a product
 */
export async function getProductRatingDistribution(
  productId: string,
  tenantId: string
): Promise<Record<number, number>> {
  const db = await getDb()

  const result = await db
    .collection<Review>("reviews")
    .aggregate([
      {
        $match: {
          productId: new ObjectId(productId),
          tenantId: new ObjectId(tenantId),
          status: "approved",
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ])
    .toArray()

  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  result.forEach((item) => {
    distribution[item._id as number] = item.count
  })

  return distribution
}

/**
 * Approve a review (admin only)
 */
export async function approveReview(
  reviewId: string,
  tenantId: string
): Promise<boolean> {
  const db = await getDb()

  const result = await db.collection("reviews").updateOne(
    { _id: new ObjectId(reviewId), tenantId: new ObjectId(tenantId) },
    { $set: { status: "approved", updatedAt: new Date() } }
  )

  return result.modifiedCount > 0
}

/**
 * Reject a review (admin only)
 */
export async function rejectReview(
  reviewId: string,
  tenantId: string
): Promise<boolean> {
  const db = await getDb()

  const result = await db.collection("reviews").updateOne(
    { _id: new ObjectId(reviewId), tenantId: new ObjectId(tenantId) },
    { $set: { status: "rejected", updatedAt: new Date() } }
  )

  return result.modifiedCount > 0
}
