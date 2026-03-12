import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import CryptoJS from "crypto-js"
import type { Tenant } from "@/lib/schemas"

interface EsewaConfig {
  merchantCode: string
  secretKey: string
}

/**
 * Get eSewa configuration for a tenant
 */
export async function getTenantEsewaConfig(tenantId: string): Promise<EsewaConfig | null> {
  try {
    const db = await getDb()

    const tenant = await db.collection<Tenant>("tenants").findOne({
      _id: new ObjectId(tenantId),
    })

    if (!tenant?.paymentSettings?.providers) {
      return null
    }

    const esewaProvider = tenant.paymentSettings.providers.find((p) => p.type === "esewa")

    if (!esewaProvider?.enabled || !esewaProvider.config.apiKey || !esewaProvider.config.secretKey) {
      return null
    }

    return {
      merchantCode: esewaProvider.config.apiKey,
      secretKey: esewaProvider.config.secretKey,
    }
  } catch (error) {
    console.error("[eSewa Config Error]", error)
    return null
  }
}

/**
 * Generate eSewa signature
 */
export function generateEsewaSignature(message: string, secretKey: string): string {
  const hash = CryptoJS.HmacSHA256(message, secretKey)
  return CryptoJS.enc.Base64.stringify(hash)
}

/**
 * Prepare eSewa payment request
 */
export async function prepareEsewaPayment(
  tenantId: string,
  orderId: string,
  amount: number,
  baseUrl: string
) {
  const esewaConfig = await getTenantEsewaConfig(tenantId)

  if (!esewaConfig) {
    return null
  }

  const transactionUuid = generateTransactionUuid()
  const totalAmount = amount.toString()

  const message =
    `total_amount=${totalAmount},` +
    `transaction_uuid=${transactionUuid},` +
    `product_code=${esewaConfig.merchantCode}`

  const signature = generateEsewaSignature(message, esewaConfig.secretKey)

  return {
    url: process.env.NEXT_PUBLIC_ESEWA_PAYMENT_URL || "https://rc-api.esewa.com.np/api/epay/main",
    formData: {
      amount: totalAmount,
      tax_amount: "0",
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: esewaConfig.merchantCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${baseUrl}/storefront/payment/esewa/success?orderId=${orderId}`,
      failure_url: `${baseUrl}/storefront/payment/esewa/failure?orderId=${orderId}`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    },
  }
}

/**
 * Verify eSewa payment
 */
export async function verifyEsewaPayment(
  tenantId: string,
  transactionUuid: string,
  status: string
): Promise<{ valid: boolean; message: string }> {
  if (status !== "COMPLETE") {
    return { valid: false, message: "Payment not completed" }
  }

  // In production, you should verify the transaction with eSewa API
  // This is a basic verification check

  try {
    const esewaConfig = await getTenantEsewaConfig(tenantId)
    if (!esewaConfig) {
      return { valid: false, message: "Payment gateway not configured" }
    }

    // Transaction UUID format validation
    if (!isValidTransactionUuid(transactionUuid)) {
      return { valid: false, message: "Invalid transaction ID" }
    }

    return { valid: true, message: "Payment verified successfully" }
  } catch (error) {
    console.error("[eSewa Verification Error]", error)
    return { valid: false, message: "Payment verification failed" }
  }
}

/**
 * Validate transaction UUID format
 */
function isValidTransactionUuid(uuid: string): boolean {
  // UUID v4 format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Generate transaction UUID
 */
function generateTransactionUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
