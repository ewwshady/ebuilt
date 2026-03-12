import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import type { Tenant } from "@/lib/schemas"

// GET all tenants (super admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden - Super admin access required" }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const tenants = await db.collection<Tenant>("tenants").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ tenants })
  } catch (error) {
    console.error("Get tenants error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch tenants" },
      { status: 500 },
    )
  }
}

// POST create new tenant (super admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden - Super admin access required" }, { status: 403 })
    }

    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { subdomain, name, description, plan, ownerEmail, ownerName, ownerPassword } = body

    if (!subdomain || typeof subdomain !== "string" || subdomain.trim().length === 0) {
      return NextResponse.json({ error: "Subdomain is required" }, { status: 400 })
    }

    const subdomainRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json(
        { error: "Subdomain must be lowercase, alphanumeric with hyphens only" },
        { status: 400 },
      )
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Store name is required" }, { status: 400 })
    }

    if (!plan || !["basic", "premium", "enterprise"].includes(plan)) {
      return NextResponse.json({ error: "Valid plan is required (basic, premium, or enterprise)" }, { status: 400 })
    }

    if (!ownerEmail || typeof ownerEmail !== "string" || !ownerEmail.includes("@")) {
      return NextResponse.json({ error: "Valid owner email is required" }, { status: 400 })
    }

    if (!ownerName || typeof ownerName !== "string" || ownerName.trim().length === 0) {
      return NextResponse.json({ error: "Owner name is required" }, { status: 400 })
    }

    if (!ownerPassword || typeof ownerPassword !== "string" || ownerPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    // Check if subdomain already exists
    const existingTenant = await db.collection<Tenant>("tenants").findOne({ subdomain: subdomain.toLowerCase() })

    if (existingTenant) {
      return NextResponse.json({ error: "Subdomain already exists" }, { status: 409 })
    }

    const existingUser = await db.collection("users").findOne({ email: ownerEmail.toLowerCase() })

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // Create tenant owner user
    const { hashPassword } = await import("@/lib/password")
    const hashedPassword = await hashPassword(ownerPassword)

    const ownerUser = {
      email: ownerEmail.toLowerCase(),
      password: hashedPassword,
      name: ownerName.trim(),
      role: "tenant_admin" as const,
      tenantId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const userResult = await db.collection("users").insertOne(ownerUser)

    // Create tenant
    const tenant: Tenant = {
      subdomain: subdomain.toLowerCase(),
      name: name.trim(),
      description: description?.trim() || "",
      status: "active",
      plan,
      ownerId: userResult.insertedId,
      customDomainVerified: false,
      theme: {
        primaryColor: "#0070f3",
        secondaryColor: "#7928ca",
      },
      settings: {
        currency: "NPR",
        taxRate: 0,
        enableReviews: true,
        enableInventory: true,
      },
      paymentSettings: {
        cod: { enabled: true, label: "Cash on Delivery" },
        esewa: { enabled: false },
        khalti: { enabled: false },
        stripe: { enabled: false },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const tenantResult = await db.collection<Tenant>("tenants").insertOne(tenant)

    // Update user with tenantId
    await db
      .collection("users")
      .updateOne({ _id: userResult.insertedId }, { $set: { tenantId: tenantResult.insertedId } })

    return NextResponse.json({ tenant: { ...tenant, _id: tenantResult.insertedId } }, { status: 201 })
  } catch (error) {
    console.error("Create tenant error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create tenant" },
      { status: 500 },
    )
  }
}
