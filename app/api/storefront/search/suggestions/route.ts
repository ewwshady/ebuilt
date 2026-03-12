import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSearchSuggestions } from "@/lib/search-service"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"

export async function GET(request: NextRequest) {
  try {
    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const query = request.nextUrl.searchParams.get("q") || ""

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const db = await getDb()
    const suggestions = await getSearchSuggestions(
      db,
      query,
      tenant._id!.toString(),
      10
    )

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("[Search Suggestions] Error:", error)
    return NextResponse.json({ suggestions: [] })
  }
}
