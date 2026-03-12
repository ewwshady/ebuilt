import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { createReview } from "@/lib/review-service"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    // Get customer session
    const session = await getSession()
    if (!session || session.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized. Please login to submit a review." }, { status: 401 })
    }

    const body = await request.json()
    const { productId, tenantId, customerName, title, comment, rating } = body

    // Validate required fields
    if (!productId || !tenantId) {
      return NextResponse.json({ error: "Product ID and Tenant ID are required" }, { status: 400 })
    }

    if (!title || !comment || !rating) {
      return NextResponse.json({ error: "Title, comment, and rating are required" }, { status: 400 })
    }

    const db = await getDb()

    // Verify product exists
    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId),
      tenantId: new ObjectId(tenantId),
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Create review with purchase verification
    const result = await createReview(session.userId, productId, tenantId, {
      customerName: customerName || session.email?.split("@")[0] || "Anonymous",
      customerEmail: session.email || "",
      title,
      comment,
      rating: parseInt(rating),
    })

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: result.message,
        reviewId: result.reviewId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[submit review]", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
