// /api/tenants/header.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function PUT(req: Request) {
  try {
    const session = await getSession(req)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = session.user
    if (!user?.tenantId) return NextResponse.json({ error: "User has no tenant" }, { status: 400 })

    const body = await req.json()
    const client = await clientPromise
    const db = client.db("ebuilt")

    await db.collection("tenants").updateOne(
      { _id: new ObjectId(user.tenantId) },
      { $set: { header: body } }
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Save header error:", err)
    return NextResponse.json({ error: "Failed to save header" }, { status: 500 })
  }
}
