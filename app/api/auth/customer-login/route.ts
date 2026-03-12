import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { comparePassword } from "@/lib/password" // FIX: Changed verifyPassword to comparePassword
import { createSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { email, password, tenantId } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }
    if (!tenantId || typeof tenantId !== "string" || !ObjectId.isValid(tenantId)) {
      return NextResponse.json({ error: "Valid tenant ID is required" }, { status: 400 })
    }

    const db = await getDb()

    // Find customer for this specific tenant
    const user = await db.collection("users").findOne({
      email: email.toLowerCase(),
      tenantId: new ObjectId(tenantId),
      role: "customer",
    })

    if (!user) {
      // Generic error to prevent email enumeration
      await new Promise((resolve) => setTimeout(resolve, 500))
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // FIX: Using comparePassword instead of verifyPassword
    const isValid = await comparePassword(password, user.password)

    if (!isValid) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (user.status === "disabled") {
      return NextResponse.json({ error: "This account has been disabled" }, { status: 403 })
    }

    // Update last login
    await db.collection("users").updateOne(
      { _id: user._id }, 
      { $set: { lastLogin: new Date() } }
    )

    // Create session
    const token = await createSession({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      tenantId: user.tenantId.toString(),
    })

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId.toString(),
      },
    })

    // Set cookie
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
