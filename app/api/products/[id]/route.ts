import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"
import type { Product } from "@/lib/schemas"

// GET single product
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    const { id } = await params

    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const product = await db.collection<Product>("products").findOne({
      _id: new ObjectId(id),
      tenantId: new ObjectId(session.tenantId),
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH update product
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    const { id } = await params

    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const client = await clientPromise
    const db = client.db("ebuilt")

    const updateData: Partial<Product> = {
      ...body,
      updatedAt: new Date(),
    }

    delete (updateData as any)._id
    delete (updateData as any).tenantId
    delete (updateData as any).createdAt

    await db.collection<Product>("products").updateOne(
      {
        _id: new ObjectId(id),
        tenantId: new ObjectId(session.tenantId),
      },
      { $set: updateData },
    )

    const updatedProduct = await db.collection<Product>("products").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    const { id } = await params

    if (!session || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    await db.collection<Product>("products").deleteOne({
      _id: new ObjectId(id),
      tenantId: new ObjectId(session.tenantId),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
