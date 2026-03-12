import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Tenant } from "@/lib/schemas"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get("domain")

    if (!domain) {
      return NextResponse.json({ error: "Domain required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const tenant = await db.collection<Tenant>("tenants").findOne({
      customDomain: domain,
      customDomainVerified: true,
      status: "active",
    })

    return NextResponse.json({
      isCustomDomain: !!tenant,
      tenantId: tenant?._id?.toString(),
    })
  } catch (error) {
    console.error("Domain check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
