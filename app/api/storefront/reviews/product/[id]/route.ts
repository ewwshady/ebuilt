import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import {
  getProductReviews,
  getProductAverageRating,
  getProductRatingDistribution,
} from "@/lib/review-service"
import { ObjectId } from "mongodb"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const db = await getDb()

    // Verify product exists
    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
      tenantId: new ObjectId(tenantId),
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Get reviews in parallel
    const [reviews, ratingStats, ratingDistribution] = await Promise.all([
      getProductReviews(id, tenantId, true),
      getProductAverageRating(id, tenantId),
      getProductRatingDistribution(id, tenantId),
    ])

    // Format reviews for response
    const formattedReviews = reviews.map((review) => ({
      id: review._id.toString(),
      customerName: review.customerName,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }))

    return NextResponse.json({
      product: {
        id: product._id?.toString(),
        name: product.name,
      },
      reviews: formattedReviews,
      stats: {
        averageRating: ratingStats.averageRating,
        totalReviews: ratingStats.totalReviews,
        distribution: ratingDistribution,
      },
    })
  } catch (error) {
    console.error("[get product reviews]", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
