import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/session"
import type { Tenant } from "@/lib/schemas"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== "tenant_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { customDomain } = await request.json()

    if (!customDomain) {
      return NextResponse.json({ error: "Custom domain required" }, { status: 400 })
    }

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i
    if (!domainRegex.test(customDomain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    // Check if domain is already taken
    const existingDomain = await db.collection<Tenant>("tenants").findOne({
      customDomain,
    })

    if (existingDomain) {
      return NextResponse.json({ error: "Domain already in use" }, { status: 400 })
    }

    // Generate verification token
    const verificationToken = generateVerificationToken()

    // Update tenant with custom domain
    await db.collection<Tenant>("tenants").updateOne(
      { _id: new ObjectId(payload.tenantId as string) },
      {
        $set: {
          customDomain,
          customDomainVerified: false,
          customDomainVerificationToken: verificationToken,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      message: "Domain added successfully",
      verificationToken,
    })
  } catch (error) {
    console.error("Add domain error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== "tenant_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    await db.collection<Tenant>("tenants").updateOne(
      { _id: new ObjectId(payload.tenantId as string) },
      {
        $unset: {
          customDomain: "",
          customDomainVerified: "",
          customDomainVerificationToken: "",
        },
        $set: {
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Domain removed successfully" })
  } catch (error) {
    console.error("Remove domain error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateVerificationToken(): string {
  return `verify-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
}
