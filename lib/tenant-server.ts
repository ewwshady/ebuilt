// lib/tenant-server.ts (Updated)

import { headers } from "next/headers"
import { getDb } from "@/lib/mongodb"
import type { Tenant } from "@/lib/schemas"
import { ObjectId } from "mongodb"

// Server-side function for getting tenant from subdomain
export async function getTenantFromSubdomain(): Promise<Tenant | null> {
  try {
    const headersList = await headers();
    
    const subdomain = headersList.get("x-tenant-subdomain")
    const customDomain = headersList.get("x-custom-domain")

    if (!subdomain && !customDomain) {
      return null
    }

    const db = await getDb()

    if (customDomain) {
      const tenant = await db.collection<Tenant>("tenants").findOne({
        customDomain,
        customDomainVerified: true,
        status: "active",
      })
      if (tenant) {
        return tenant
      }
    }

    if (subdomain) {
      const query = { subdomain: subdomain, status: "active" };
      const tenant = await db.collection<Tenant>("tenants").findOne(query);
      return tenant
    }

    return null
  } catch (error) {
    console.error("Error in getTenantFromSubdomain:", error);
    return null
  }
}

export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  try {
    const db = await getDb()
    const tenant = await db.collection<Tenant>("tenants").findOne({
      _id: new ObjectId(tenantId),
    })
    return tenant
  } catch (error) {
    console.error("Error fetching tenant by ID:", error)
    return null
  }
}

export function serializeTenant(tenant: any): Tenant {
  return {
    ...tenant,
    _id: tenant._id?.toString(),
    ownerId: tenant.ownerId?.toString(),
    createdAt: tenant.createdAt?.toISOString(),
    updatedAt: tenant.updatedAt?.toISOString(),
  };
}
