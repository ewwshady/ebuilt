import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { hashPassword } from "@/lib/password"
import { createSession } from "@/lib/session"
import {
  validateEmail,
  validatePassword,
  validateName,
  validateSubdomain,
  validateStoreName,
  validateBatch,
} from "@/lib/validation"


const defaultHeader = {
  showTitle: true,
  logo: undefined,
  menu: [
    { label: "Shop", href: "/products" },
    { label: "Collections", href: "/collections" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  icons: {
    search: true,
    wishlist: true,
    account: true,
    cart: true,
  },
}

export async function POST(req: Request) {
  try {
    // Parse JSON body
    const body = await req.json()

    const storeName = body.storeName as string
    const subdomain = body.subdomain as string
    const ownerName = body.ownerName as string
    const email = body.email as string
    const password = body.password as string
    const description = body.description || ""

    // Strict input validation
    const validations = [
      ["storeName", validateStoreName(storeName)],
      ["subdomain", validateSubdomain(subdomain)],
      ["ownerName", validateName(ownerName)],
      ["email", validateEmail(email)],
      ["password", validatePassword(password)],
    ] as const

    const { valid: allValid, errors } = validateBatch(validations)

    if (!allValid) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 })
    }



    // Use getDb() instead of hardcoded db
    const db = await getDb()

    // Check if subdomain/email already exists
    const existingTenant = await db.collection("tenants").findOne({ subdomain })
    if (existingTenant) return NextResponse.json({ error: "Subdomain already in use" }, { status: 409 })

    const existingUser = await db.collection("users").findOne({ email: email.toLowerCase() })
    if (existingUser) return NextResponse.json({ error: "Email already registered" }, { status: 409 })

    // Default theme: beauty-test
    const theme = await db.collection("themes").findOne({ key: "beauty-test" })
    if (!theme) throw new Error("Default theme not found")

    // Create tenant admin user
    const hashedPassword = await hashPassword(password)
    const userResult = await db.collection("users").insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: ownerName,
      role: "tenant_admin",
      tenantId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    const userId = userResult.insertedId

    const now = new Date()
    const tenantResult = await db.collection("tenants").insertOne({
      name: storeName,
      subdomain,
      ownerId: userId,
      description,
      status: "active",
      plan: "basic",
      category: theme.category || "general",
      themeKey: theme.key,
      theme: {
        primaryColor: theme.primaryColor || "#ec4899",
        secondaryColor: theme.secondaryColor || "#ffffff",
        accentColor: theme.accentColor || "#F472B6",
      },
      header: {
        ...defaultHeader,
      },
      footer: theme.footer || {},
      customDomainVerified: false,
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
      createdAt: now,
      updatedAt: now,
    })

    // Attach tenantId to user
    await db.collection("users").updateOne({ _id: userId }, { $set: { tenantId: tenantResult.insertedId } })

    // Create session cookie
    const token = await createSession({
      userId: userId.toString(),
      email,
      role: "tenant_admin",
      tenantId: tenantResult.insertedId.toString(),
    })

    const res = NextResponse.json(
      {
        success: true,
        tenant: {
          _id: tenantResult.insertedId.toString(),
          subdomain,
          name: storeName,
          themeKey: theme.key,
          theme: {
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            accentColor: theme.accentColor || "#F472B6",
          },
          header: {
            ...defaultHeader,
          },
          footer: theme.footer || {},
        },
      },
      { status: 201 }
    )

    res.cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create store" },
      { status: 500 }
    )
  }
}
