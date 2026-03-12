import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb" // Switched to central utility
import { hashPassword } from "@/lib/password"
import { createSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, tenantId } = body

    if (!email || !password || !name || !tenantId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()

    // Check store status
    const tenant = await db.collection("tenants").findOne({ _id: new ObjectId(tenantId) })
    if (!tenant || tenant.status !== "active") {
      return NextResponse.json({ error: "Store not available" }, { status: 403 })
    }

    // Check existing
    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
      tenantId: new ObjectId(tenantId),
    })
    if (existingUser) return NextResponse.json({ error: "Email already registered here" }, { status: 409 })

    const hashedPassword = await hashPassword(password)

    const user: any = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      role: "customer",
      tenantId: new ObjectId(tenantId),
      status: "active",
      acceptsMarketing: false,
      profile: { phone: "", avatar: "", addresses: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(user)
    
    const token = await createSession({
      userId: result.insertedId.toString(),
      email: user.email,
      role: user.role,
      tenantId: user.tenantId.toString(),
    })

    const response = NextResponse.json({
      user: { id: result.insertedId.toString(), email: user.email, name: user.name }
    }, { status: 201 })

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
