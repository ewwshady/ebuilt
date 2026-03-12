import { NextResponse } from "next/server"
import { clearAdminSessionCookie } from "@/lib/admin-auth"

export async function POST() {
  try {
    await clearAdminSessionCookie()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[admin logout] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
