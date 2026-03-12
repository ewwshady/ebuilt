import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"
import { ObjectId } from "mongodb"
import type { PaymentProvider } from "@/lib/schemas"

export async function POST(request: Request) {
  try {
    // Verify admin session
    const session = await getSession()
    if (!session || session.role !== "tenant_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get tenant from subdomain
    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant || tenant._id?.toString() !== session.tenantId) {
      return NextResponse.json({ error: "Tenant mismatch" }, { status: 403 })
    }

    const body = await request.json()
    const { paymentType, enabled, apiKey, secretKey } = body

    if (!paymentType) {
      return NextResponse.json({ error: "Payment type is required" }, { status: 400 })
    }

    const db = await getDb()

    // Validate payment type
    const validTypes = ["cod", "esewa", "stripe", "khalti"]
    if (!validTypes.includes(paymentType)) {
      return NextResponse.json({ error: "Invalid payment type" }, { status: 400 })
    }

    // Get current tenant
    const currentTenant = await db.collection("tenants").findOne({
      _id: new ObjectId(tenant._id!),
    })

    if (!currentTenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Prepare provider config
    const providerConfig: PaymentProvider = {
      type: paymentType as "cod" | "esewa" | "stripe" | "khalti",
      enabled: enabled === true,
      mode: "live",
      config: {},
    }

    // Add API keys for eSewa
    if (paymentType === "esewa") {
      if (!apiKey || !secretKey) {
        return NextResponse.json(
          { error: "API key and secret key are required for eSewa" },
          { status: 400 }
        )
      }

      // Validate keys are not empty
      if (apiKey.trim().length === 0 || secretKey.trim().length === 0) {
        return NextResponse.json(
          { error: "API key and secret key cannot be empty" },
          { status: 400 }
        )
      }

      providerConfig.config.apiKey = apiKey.trim()
      providerConfig.config.secretKey = secretKey.trim()
    }

    // Initialize payment settings if not exists
    let paymentSettings = currentTenant.paymentSettings || { providers: [] }
    if (!paymentSettings.providers) {
      paymentSettings.providers = []
    }

    // Update or add provider
    const existingIndex = paymentSettings.providers.findIndex((p: PaymentProvider) => p.type === paymentType)
    if (existingIndex >= 0) {
      paymentSettings.providers[existingIndex] = providerConfig
    } else {
      paymentSettings.providers.push(providerConfig)
    }

    // Update tenant
    await db.collection("tenants").updateOne(
      { _id: new ObjectId(tenant._id!) },
      {
        $set: {
          paymentSettings,
          updatedAt: new Date().toISOString(),
        },
      }
    )

    return NextResponse.json({
      message: `${paymentType} payment settings updated successfully`,
      paymentProvider: providerConfig,
    })
  } catch (error) {
    console.error("[payment settings update]", error)
    return NextResponse.json({ error: "Failed to update payment settings" }, { status: 500 })
  }
}
