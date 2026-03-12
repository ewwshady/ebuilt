import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { sendOTPEmail } from "@/lib/email"
import { storeOTP } from "@/lib/otp"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"
import { validateEmail } from "@/lib/validation"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Strict email validation
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 })
    }

    // Get tenant from subdomain
    const tenant = await getTenantFromSubdomainHeader()
    if (!tenant) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const db = await getDb()

    // Check if user exists as tenant_admin
    const user = await db.collection("users").findOne({
      email: email.toLowerCase(),
      tenantId: new ObjectId(tenant._id!),
      role: "tenant_admin",
    })

    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, you'll receive a password reset code." },
        { status: 200 }
      )
    }

    // Generate and store OTP
    const otp = await storeOTP(email.toLowerCase(), "password_reset")

    // Send email with OTP
    await sendOTPEmail(email, otp, "password_reset")

    return NextResponse.json(
      { message: "Password reset code sent to your email" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[tenant password reset request]", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
