import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/session"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const tenantId = searchParams.get("tenantId")
    const status = searchParams.get("status") || "approved"

    if (productId && !ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    if (tenantId && !ObjectId.isValid(tenantId)) {
      return NextResponse.json({ error: "Invalid tenant ID format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const filter: any = { status }
    if (productId) filter.productId = new ObjectId(productId)
    if (tenantId) filter.tenantId = new ObjectId(tenantId)

    const reviews = await db.collection("reviews").find(filter).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Fetch reviews error:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - Login required to submit review" }, { status: 401 })
    }

    const session = await verifyToken(token)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Invalid or expired token" }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { productId, tenantId, rating, title, comment } = body

    if (!productId || !ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    if (!tenantId || !ObjectId.isValid(tenantId)) {
      return NextResponse.json({ error: "Invalid tenant ID" }, { status: 400 })
    }

    const ratingNum = Number(rating)
    if (!rating || isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Review title is required" }, { status: 400 })
    }

    if (!comment || typeof comment !== "string" || comment.trim().length < 10) {
      return NextResponse.json({ error: "Review comment must be at least 10 characters" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId),
      tenantId: new ObjectId(tenantId),
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Get user info
    const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const existingReview = await db.collection("reviews").findOne({
      productId: new ObjectId(productId),
      customerId: new ObjectId(session.userId),
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 })
    }

    const review = {
      tenantId: new ObjectId(tenantId),
      productId: new ObjectId(productId),
      customerId: new ObjectId(session.userId),
      customerName: user.name,
      customerEmail: user.email,
      rating: ratingNum,
      title: title.trim(),
      comment: comment.trim(),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("reviews").insertOne(review)

    return NextResponse.json({ review: { ...review, _id: result.insertedId } }, { status: 201 })
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create review" },
      { status: 500 },
    )
  }
}
