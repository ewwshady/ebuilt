import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { User } from "@/lib/schemas"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ user: null })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const user = await db
      .collection<User>("users")
      .findOne({ _id: new ObjectId(session.userId) }, { projection: { password: 0 } })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ user: null })
  }
}
