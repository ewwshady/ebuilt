import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"
import { getComprehensiveAnalytics } from "@/lib/analytics-service"

export async function GET(request: Request) {
  try {
    // Verify session
    const session = await getSession()
    if (!session || session.role !== "tenant_admin" || !session.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get tenant from subdomain
    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant || tenant._id?.toString() !== session.tenantId) {
      return NextResponse.json({ error: "Tenant mismatch" }, { status: 403 })
    }

    // Get comprehensive analytics
    const analytics = await getComprehensiveAnalytics(session.tenantId)

    return NextResponse.json({ analytics }, { status: 200 })
  } catch (error) {
    console.error("[tenant analytics error]", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
