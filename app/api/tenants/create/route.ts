import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { hashPassword } from "@/lib/password"
import { createSession } from "@/lib/session"
import fs from "fs"
import path from "path"

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
    // Support multipart/form-data
    const formData = await req.formData()

    const storeName = formData.get("storeName") as string
    const subdomain = formData.get("subdomain") as string
    const ownerName = formData.get("ownerName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const description = (formData.get("description") as string) || ""

    const logoFile = formData.get("logo") as File | null
    const bannerFile = formData.get("banner") as File | null

    if (!storeName || !subdomain || !ownerName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Ensure upload folder exists
    const uploadDir = path.join(process.cwd(), "public/stores")
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

    // Save uploaded logo/banner
    const safeName = storeName.toLowerCase().replace(/\s+/g, "-")
    let logo = ""
    let banner = ""

    if (logoFile) {
      const bytes = await logoFile.arrayBuffer()
      fs.writeFileSync(path.join(uploadDir, `${safeName}-logo.png`), Buffer.from(bytes))
      logo = `/stores/${safeName}-logo.png`
    }

    if (bannerFile) {
      const bytes = await bannerFile.arrayBuffer()
      fs.writeFileSync(path.join(uploadDir, `${safeName}-banner.png`), Buffer.from(bytes))
      banner = `/stores/${safeName}-banner.png`
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
      plan: "basic", // fixed default
      category: theme.category || "general",
      themeKey: theme.key,
      theme: {
        primaryColor: theme.primaryColor || "#ec4899",
        secondaryColor: theme.secondaryColor || "#ffffff",
        accentColor: theme.accentColor || "#F472B6",
        logo: logo || theme.logo,
        banner: banner || theme.banner,
      },
      logo,
      banner,
      header: {
        ...defaultHeader,
        logo: logo || theme.logo,
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
        tenant: {
          _id: tenantResult.insertedId.toString(),
          subdomain,
          name: storeName,
          themeKey: theme.key,
          theme: {
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            accentColor: theme.accentColor || "#F472B6",
            logo: logo || theme.logo,
            banner: banner || theme.banner,
          },
          logo,
          banner,
          header: {
            ...defaultHeader,
            logo: logo || theme.logo,
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