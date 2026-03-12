import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/mongodb"
import { getAdminSession } from "@/lib/admin-auth"
import { encrypt, isEncrypted } from "@/lib/payment-crypto"

const ALLOWED_PROVIDERS = ["stripe", "cod", "khalti", "esewa"]

// ---------------- GET ----------------
export async function GET() {
  const session = await getAdminSession()
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const db = await getDb()

  const tenant = await db.collection("tenants").findOne({
    _id: new ObjectId(session.tenantId),
  })

  return NextResponse.json({
    providers: tenant?.paymentSettings?.providers || [],
  })
}

// ---------------- PUT ----------------
export async function PUT(request: Request) {
  const session = await getAdminSession()
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()

  if (!Array.isArray(body.providers)) {
    return NextResponse.json(
      { error: "Invalid providers format" },
      { status: 400 }
    )
  }

  const db = await getDb()

  const existingTenant = await db.collection("tenants").findOne({
    _id: new ObjectId(session.tenantId),
  })

  const existingProviders =
    existingTenant?.paymentSettings?.providers || []

  const providers = body.providers.map((provider: any) => {
    if (!ALLOWED_PROVIDERS.includes(provider.type)) {
      throw new Error("Invalid provider type")
    }

    const existing = existingProviders.find(
      (p: any) => p.type === provider.type
    )

    const updatedConfig = { ...provider.config }

    // Prevent secret deletion + prevent double encryption
    if (provider.config?.secretKey) {
      if (!isEncrypted(provider.config.secretKey)) {
        updatedConfig.secretKey = encrypt(provider.config.secretKey)
      }
    } else if (existing?.config?.secretKey) {
      updatedConfig.secretKey = existing.config.secretKey
    }

    if (provider.config?.webhookSecret) {
      if (!isEncrypted(provider.config.webhookSecret)) {
        updatedConfig.webhookSecret = encrypt(
          provider.config.webhookSecret
        )
      }
    } else if (existing?.config?.webhookSecret) {
      updatedConfig.webhookSecret =
        existing.config.webhookSecret
    }

    return {
      type: provider.type,
      enabled: !!provider.enabled,
      mode: provider.mode || "test",
      config: updatedConfig,
    }
  })

  await db.collection("tenants").updateOne(
    { _id: new ObjectId(session.tenantId) },
    {
      $set: {
        paymentSettings: { providers },
        updatedAt: new Date(),
      },
    }
  )

  return NextResponse.json({ success: true })
}