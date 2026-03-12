import { getDb } from "./mongodb"
import { ObjectId } from "mongodb"

export interface OTPRecord {
  _id?: ObjectId
  email: string
  otp: string
  purpose: "email_verification" | "password_reset"
  expiresAt: Date
  attempts: number
  maxAttempts: number
  createdAt: Date
  verified?: boolean
}

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store OTP in database
export async function storeOTP(
  email: string,
  purpose: "email_verification" | "password_reset"
): Promise<string> {
  const otp = generateOTP()
  const db = await getDb()
  
  // Clear existing OTPs for this email and purpose
  await db.collection("otps").deleteMany({
    email: email.toLowerCase(),
    purpose,
  })

  // Store new OTP (valid for 10 minutes)
  await db.collection<OTPRecord>("otps").insertOne({
    email: email.toLowerCase(),
    otp,
    purpose,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    attempts: 0,
    maxAttempts: 5,
    createdAt: new Date(),
  })

  return otp
}

// Verify OTP
export async function verifyOTP(
  email: string,
  otp: string,
  purpose: "email_verification" | "password_reset"
): Promise<{ valid: boolean; message: string }> {
  const db = await getDb()

  const record = await db.collection<OTPRecord>("otps").findOne({
    email: email.toLowerCase(),
    purpose,
  })

  if (!record) {
    return { valid: false, message: "OTP not found or expired" }
  }

  if (record.expiresAt < new Date()) {
    await db.collection("otps").deleteOne({ _id: record._id })
    return { valid: false, message: "OTP has expired" }
  }

  if (record.attempts >= record.maxAttempts) {
    await db.collection("otps").deleteOne({ _id: record._id })
    return { valid: false, message: "Maximum attempts exceeded. Request a new OTP." }
  }

  if (record.otp !== otp) {
    await db.collection("otps").updateOne(
      { _id: record._id },
      { $inc: { attempts: 1 } }
    )
    return { valid: false, message: "Invalid OTP" }
  }

  // Mark as verified
  await db.collection("otps").updateOne(
    { _id: record._id },
    { $set: { verified: true } }
  )

  return { valid: true, message: "OTP verified successfully" }
}

// Clear verified OTP
export async function clearOTP(
  email: string,
  purpose: "email_verification" | "password_reset"
): Promise<void> {
  const db = await getDb()
  await db.collection("otps").deleteOne({
    email: email.toLowerCase(),
    purpose,
    verified: true,
  })
}
