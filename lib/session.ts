import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const secretKey = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const key = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  userId: string
  email: string
  role: string
  tenantId?: string
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return token
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, key)
    return payload as SessionPayload
  } catch {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload as SessionPayload
  } catch {
    return null
  }
}
