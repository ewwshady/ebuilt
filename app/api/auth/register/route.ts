import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { hashPassword } from "@/lib/password"
import { storeOTP } from "@/lib/otp"
import { sendOTPEmail } from "@/lib/email"
import {
  validateEmail,
  validatePassword,
  validateName,
  validateBatch,
} from "@/lib/validation"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, tenantId } = body

    // Strict input validation
    const validations = [
      ["email", validateEmail(email)],
      ["password", validatePassword(password)],
      ["name", validateName(name)],
      ["tenantId", tenantId ? { valid: true } : { valid: false, error: "Store ID is required" }],
    ] as const

    const { valid: allValid, errors } = validateBatch(validations)

    if (!allValid) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 })
    }

    const db = await getDb()

    // Check store status
    const tenant = await db.collection("tenants").findOne({ _id: new ObjectId(tenantId) })
    if (!tenant || tenant.status !== "active") {
      return NextResponse.json({ error: "Store not available" }, { status: 403 })
    }

    // Check existing
    const existingUser = await db.collection("users").findOne({
      email: email.toLowerCase(),
      tenantId: new ObjectId(tenantId),
    })
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered here" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const user: any = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      role: "customer",
      tenantId: new ObjectId(tenantId),
      status: "pending", // Changed to pending until email verified
      emailVerified: false,
      acceptsMarketing: false,
      profile: { phone: "", avatar: "", addresses: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(user)

    // Generate and send OTP for email verification
    const otp = await storeOTP(email.toLowerCase(), "email_verification")
    await sendOTPEmail(email, otp, "email_verification")

    return NextResponse.json(
      {
        message: "Registration successful. Please verify your email to complete signup.",
        user: {
          id: result.insertedId.toString(),
          email: user.email,
          name: user.name,
          tenantId: tenantId,
        },
        requiresEmailVerification: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[registration]", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
