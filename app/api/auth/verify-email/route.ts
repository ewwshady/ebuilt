import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { verifyOTP, clearOTP } from "@/lib/otp"
import { validateEmail, validateOTP, validateBatch } from "@/lib/validation"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, otp, tenantId } = body

    // Strict input validation
    const validations = [
      ["email", validateEmail(email)],
      ["otp", validateOTP(otp)],
      ["tenantId", tenantId ? { valid: true } : { valid: false, error: "Tenant ID is required" }],
    ] as const

    const { valid: allValid, errors } = validateBatch(validations)

    if (!allValid) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 })
    }

    const db = await getDb()

    // Verify OTP
    const otpVerification = await verifyOTP(email.toLowerCase(), otp, "email_verification")
    if (!otpVerification.valid) {
      return NextResponse.json({ error: otpVerification.message }, { status: 400 })
    }

    // Find user
    const user = await db.collection("users").findOne({
      email: email.toLowerCase(),
      tenantId: new ObjectId(tenantId),
      role: "customer",
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Mark email as verified
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerified: true,
          status: "active",
          updatedAt: new Date(),
        },
      }
    )

    // Clear OTP
    await clearOTP(email.toLowerCase(), "email_verification")

    return NextResponse.json({
      message: "Email verified successfully",
      user: {
        id: user._id?.toString(),
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("[email verification]", error)
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
  }
}
