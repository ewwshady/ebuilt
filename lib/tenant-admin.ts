import { headers } from "next/headers"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Tenant } from "@/lib/schemas"

/**
 * Get tenant from subdomain header (set by middleware)
 * Used primarily in API routes
 */
export async function getTenantFromSubdomainHeader(): Promise<Tenant | null> {
  try {
    const headersList = await headers()
    const subdomain = headersList.get("x-tenant-subdomain")

    if (!subdomain) {
      return null
    }

    const client = await clientPromise
    const db = client.db("ebuilt")
    const tenant = await db.collection<Tenant>("tenants").findOne({ subdomain })

    return tenant
  } catch (error) {
    console.error("[admin] Error getting tenant from subdomain:", error)
    return null
  }
}

/**
 * Validate that the admin session tenant matches the request tenant
 */
export function validateTenantMatch(sessionTenantId: string, requestTenantId: string | ObjectId): boolean {
  const requestId = typeof requestTenantId === "string" ? requestTenantId : requestTenantId.toString()
  return sessionTenantId === requestId
}
