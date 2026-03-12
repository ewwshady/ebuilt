import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getAdminSession } from "@/lib/admin-auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getAdminSession()
    if (!session || !ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid Request" }, { status: 400 })

    const db = await getDb()
    const product = await db.collection("products").findOne({ _id: new ObjectId(id), tenantId: new ObjectId(session.tenantId) })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })

    return NextResponse.json({ 
      product: { 
        ...product, 
        _id: product._id.toString(), 
        tenantId: product.tenantId.toString(),
        collections: product.collections?.map((c: any) => c.toString()) || []
      } 
    })
  } catch (error) { return NextResponse.json({ error: "Error" }, { status: 500 }) }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getAdminSession()
    if (!session || !ObjectId.isValid(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const db = await getDb()

    // Data cleaning for Mongo
    delete body._id
    delete body.tenantId
    if (body.collections) {
      body.collections = body.collections.filter((c: string) => c.length === 24 && ObjectId.isValid(c)).map((c: string) => new ObjectId(c))
    }

    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(id), tenantId: new ObjectId(session.tenantId) },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: "after" }
    )
    return NextResponse.json({ success: true, product: result })
  } catch (error) { return NextResponse.json({ error: "Error" }, { status: 500 }) }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getAdminSession()
    const db = await getDb()
    await db.collection("products").deleteOne({ _id: new ObjectId(id), tenantId: new ObjectId(session.tenantId) })
    return NextResponse.json({ success: true })
  } catch (error) { return NextResponse.json({ error: "Error" }, { status: 500 }) }
}
