import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getTenantFromSubdomainHeader, validateTenantMatch } from "@/lib/tenant-admin"
import { getAdminSession } from "@/lib/admin-auth"
import { ObjectId } from "mongodb"
import crypto from "crypto"

// ---------------- Helper to encrypt sensitive keys ----------------
function encryptKey(key: string) {
  const secret = process.env.ENCRYPTION_SECRET
  if (!secret) throw new Error("ENCRYPTION_SECRET not set")
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(secret).digest(),
    Buffer.alloc(16, 0)
  )
  let encrypted = cipher.update(key, "utf8", "hex")
  encrypted += cipher.final("hex")
  return encrypted
}

// ---------------- GET Payment Settings ----------------
export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant || !validateTenantMatch(session.tenantId, tenant._id!))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

    const providers = tenant.paymentSettings?.providers || []

    return NextResponse.json({ providers })
  } catch (error) {
    console.error("[payment-settings GET] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ---------------- PUT Payment Settings ----------------
export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant || !validateTenantMatch(session.tenantId, tenant._id!))
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

    const body = await request.json()
    const providers = body.providers || []

    // Encrypt secret keys for security
    const encryptedProviders = providers.map((p: any) => {
      if (p.enabled && p.config?.secretKey) {
        return {
          ...p,
          config: { ...p.config, secretKey: encryptKey(p.config.secretKey) },
        }
      }
      return p
    })

    const db = await getDb()

    const result = await db.collection("tenants").findOneAndUpdate(
      { _id: new ObjectId(session.tenantId) },
      {
        $set: {
          "paymentSettings.providers": encryptedProviders,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    )

    if (!result.value) return NextResponse.json({ error: "Tenant not found" }, { status: 404 })

    return NextResponse.json({ success: true, providers: result.value.paymentSettings?.providers || [] })
  } catch (error) {
    console.error("[payment-settings PUT] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}