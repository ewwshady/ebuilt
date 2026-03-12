import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/session"
import type { Tenant } from "@/lib/schemas"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== "tenant_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const tenant = await db.collection<Tenant>("tenants").findOne({
      _id: new ObjectId(payload.tenantId as string),
    })

    if (!tenant?.customDomain) {
      return NextResponse.json({ error: "No custom domain configured" }, { status: 400 })
    }

    // Check DNS records
    const dnsVerified = await verifyDNS(tenant.customDomain, tenant.customDomainVerificationToken!)

    if (dnsVerified) {
      await db.collection<Tenant>("tenants").updateOne(
        { _id: new ObjectId(payload.tenantId as string) },
        {
          $set: {
            customDomainVerified: true,
            updatedAt: new Date(),
          },
        },
      )

      return NextResponse.json({
        verified: true,
        message: "Domain verified successfully",
      })
    }

    return NextResponse.json({
      verified: false,
      message: "DNS verification failed. Please ensure DNS records are correctly configured.",
    })
  } catch (error) {
    console.error("Verify domain error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function verifyDNS(domain: string, verificationToken: string): Promise<boolean> {
  try {
    // Check TXT record for verification token
    const dnsUrl = `https://dns.google/resolve?name=_vercel-challenge.${domain}&type=TXT`
    const response = await fetch(dnsUrl)
    const data = await response.json()

    if (data.Answer) {
      for (const record of data.Answer) {
        if (record.data && record.data.includes(verificationToken)) {
          return true
        }
      }
    }

    // Also check A record points to platform
    const aRecordUrl = `https://dns.google/resolve?name=${domain}&type=A`
    const aResponse = await fetch(aRecordUrl)
    const aData = await aResponse.json()

    // You would check if the IP matches your platform's IP
    // For now, we'll accept if TXT record is present
    return false
  } catch (error) {
    console.error("DNS verification error:", error)
    return false
  }
}
