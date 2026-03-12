import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getSuperAdminAnalytics } from "@/lib/super-admin-analytics"

export async function GET(request: Request) {
  try {
    // Verify super admin session
    const session = await getSession()
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized. Super admin access required." }, { status: 401 })
    }

    // Get comprehensive analytics
    const analytics = await getSuperAdminAnalytics()

    return NextResponse.json({ analytics }, { status: 200 })
  } catch (error) {
    console.error("[super admin analytics error]", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
