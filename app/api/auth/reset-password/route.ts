import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { verifyOTP, clearOTP } from "@/lib/otp"
import { hashPassword } from "@/lib/password"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, otp, newPassword, confirmPassword } = body

    if (!email || !otp || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const db = await getDb()

    // Verify OTP
    const otpVerification = await verifyOTP(email.toLowerCase(), otp, "password_reset")
    if (!otpVerification.valid) {
      return NextResponse.json({ error: otpVerification.message }, { status: 400 })
    }

    // Find user
    const user = await db.collection("users").findOne({
      email: email.toLowerCase(),
      role: "customer",
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    )

    // Clear OTP
    await clearOTP(email.toLowerCase(), "password_reset")

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 })
  } catch (error) {
    console.error("[password reset]", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
