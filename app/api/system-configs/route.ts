import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("ebuilt")

    const configs = await db
      .collection("system_configs")
      .find({})
      .toArray()

    // Convert _id to string for frontend
    const sanitized = configs.map(c => ({
      ...c,
      _id: c._id.toString(),
      values: c.values,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }))

    return NextResponse.json(sanitized)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch system configs" }, { status: 500 })
  }
}
