import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-change-in-production")

export interface AdminSession {
  tenantId: string
  adminId: string
  email: string
  name: string
  role: "tenant_admin"
  iat?: number
  exp?: number
}

export async function createAdminSession(session: AdminSession): Promise<string> {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)

  return token
}

export async function verifyAdminSession(token: string): Promise<AdminSession | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as AdminSession
  } catch (error) {
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value

    if (!token) {
      return null
    }

    return await verifyAdminSession(token)
  } catch (error) {
    return null
  }
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  })
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
}
