import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"
import { categoryThemes } from "@/lib/category-themes"
import { ObjectId } from "mongodb"

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
    const { themeId, colors, layout, typography } = body

    if (!themeId) {
      return NextResponse.json({ error: "Theme ID is required" }, { status: 400 })
    }

    // Validate theme exists
    const baseTheme = categoryThemes[themeId]
    if (!baseTheme) {
      return NextResponse.json({ error: "Invalid theme ID" }, { status: 400 })
    }

    const db = await getDb()

    // Prepare theme configuration
    const themeConfig = {
      baseTheme: themeId,
      colors: colors || baseTheme.defaultColors,
      layout: layout || baseTheme.layout,
      typography: typography || baseTheme.typography,
      customizations: {
        colors: colors ? true : false,
        layout: layout ? true : false,
        typography: typography ? true : false,
      },
    }

    // Update tenant with theme
    const result = await db.collection("tenants").updateOne(
      { _id: new ObjectId(tenant._id!) },
      {
        $set: {
          theme: themeConfig,
          updatedAt: new Date().toISOString(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Theme "${baseTheme.name}" applied successfully`,
      theme: {
        id: themeId,
        name: baseTheme.name,
        description: baseTheme.description,
        config: themeConfig,
      },
    })
  } catch (error) {
    console.error("[apply theme]", error)
    return NextResponse.json({ error: "Failed to apply theme" }, { status: 500 })
  }
}
