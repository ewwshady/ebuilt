import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ items: [] })

    const db = await getDb()
    
    // 1. Get wishlist IDs for this user and store
    const wishlistItems = await db.collection("wishlist").find({
      userId: new ObjectId(session.userId),
      tenantId: new ObjectId(session.tenantId)
    }).toArray()

    if (wishlistItems.length === 0) return NextResponse.json({ items: [] })

    // 2. Fetch full product details for those IDs
    const productIds = wishlistItems.map(item => item.productId)
    const products = await db.collection("products").find({
      _id: { $in: productIds },
      status: "active"
    }).toArray()

    // Serialize for frontend
    const serialized = products.map(p => ({
      ...p,
      _id: p._id.toString(),
      image: typeof p.images?.[0] === 'string' ? p.images[0] : p.images?.[0]?.url || ""
    }))

    return NextResponse.json({ items: serialized })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: "Please login to save favorites" }, { status: 401 })

    const { productId } = await request.json()
    const db = await getDb()

    const query = {
      userId: new ObjectId(session.userId),
      tenantId: new ObjectId(session.tenantId),
      productId: new ObjectId(productId)
    }

    // TOGGLE LOGIC: If exists, remove. If not, add.
    const existing = await db.collection("wishlist").findOne(query)

    if (existing) {
      await db.collection("wishlist").deleteOne(query)
      return NextResponse.json({ added: false })
    } else {
      await db.collection("wishlist").insertOne({
        ...query,
        createdAt: new Date()
      })
      return NextResponse.json({ added: true })
    }
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
