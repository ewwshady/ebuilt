import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"
import { comparePassword } from "@/lib/password"
import { createAdminSession, setAdminSessionCookie } from "@/lib/admin-auth"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"
import { ObjectId } from "mongodb"
import type { User } from "@/lib/schemas"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    // Get tenant from subdomain header (set by middleware)
    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    // Find user with tenant_admin role for this tenant
    const user = await db.collection<User>("users").findOne({
      email: email.toLowerCase(),
      tenantId: new ObjectId(tenant._id!),
      role: "tenant_admin",
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials or insufficient permissions" }, { status: 401 })
    }

    // Verify password
    const passwordValid = await comparePassword(password, user.password)
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    await db.collection<User>("users").updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })

    // Create session
    const session = {
      tenantId: tenant._id!.toString(),
      adminId: user._id!.toString(),
      email: user.email,
      name: user.name || "Admin",
      role: "tenant_admin" as const,
    }

    const token = await createAdminSession(session)
    await setAdminSessionCookie(token)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id!.toString(),
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[admin login] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
