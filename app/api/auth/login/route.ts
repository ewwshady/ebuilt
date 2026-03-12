import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyPassword } from "@/lib/password"
import { createSession } from "@/lib/session"
import type { User } from "@/lib/schemas"

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { email, password } = body

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    if (!password || typeof password !== "string" || password.length === 0) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const user = await db.collection<User>("users").findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    await db.collection("users").updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })

    const token = await createSession({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
      tenantId: user.tenantId?.toString(),
    })

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed" }, { status: 500 })
  }
}
