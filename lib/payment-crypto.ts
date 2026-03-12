// lib/payment-crypto.ts

import crypto from "crypto"

const algorithm = "aes-256-ctr"

if (!process.env.PAYMENT_SECRET_KEY) {
  throw new Error("Missing PAYMENT_SECRET_KEY in env")
}

const secretKey = process.env.PAYMENT_SECRET_KEY!

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  )

  const encrypted = Buffer.concat([
    cipher.update(text),
    cipher.final(),
  ])

  return iv.toString("hex") + ":" + encrypted.toString("hex")
}

export function decrypt(hash: string) {
  const [ivHex, contentHex] = hash.split(":")

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(ivHex, "hex")
  )

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(contentHex, "hex")),
    decipher.final(),
  ])

  return decrypted.toString()
}

export function isEncrypted(value: string) {
  return value.includes(":")
}