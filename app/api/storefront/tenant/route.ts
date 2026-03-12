// app/api/storefront/tenant/route.ts
import { NextResponse } from "next/server"
import { getTenantFromSubdomain, serializeTenant } from "@/lib/tenant-server"

export async function GET() {
  try {
    const tenantRaw = await getTenantFromSubdomain()

    if (!tenantRaw) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Serialize the tenant data to make it a plain object, safe for client-side use.
    const tenant = serializeTenant(tenantRaw);
    
    return NextResponse.json({ tenant })

  } catch (error) {
    console.error("API /storefront/tenant Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
