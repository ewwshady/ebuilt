import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyPassword } from "@/lib/password"
import { createSession } from "@/lib/session"
import { validateEmail, validateBatch } from "@/lib/validation"
import type { User } from "@/lib/schemas"

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const { email, password } = body

    // Strict input validation
    const validations = [
      ["email", validateEmail(email)],
      [
        "password",
        password && typeof password === "string" && password.length > 0
          ? { valid: true }
          : { valid: false, error: "Password is required" },
      ],
    ] as const

    const { valid: allValid, errors } = validateBatch(validations)

    if (!allValid) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 })
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
