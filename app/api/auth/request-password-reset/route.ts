import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { sendOTPEmail } from "@/lib/email"
import { storeOTP } from "@/lib/otp"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const db = await getDb()

    // Check if user exists
    const user = await db.collection("users").findOne({
      email: email.toLowerCase(),
      role: "customer",
    })

    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json(
        { message: "If an account exists with this email, you'll receive a password reset code." },
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
    console.error("[password reset request]", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
