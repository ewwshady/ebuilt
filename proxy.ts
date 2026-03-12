import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const url = request.nextUrl
  const isCustomDomain = await checkIfCustomDomain(hostname)
  const subdomain = getSubdomain(hostname)

  // Allow all static files, API routes, favicon, icons, and /stores
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||   // APIs
    url.pathname.startsWith("/favicon") ||
    url.pathname.startsWith("/icon") ||
    url.pathname.startsWith("/stores") || 

    url.pathname.includes(".")            // any other file extensions
  ) {
    const response = NextResponse.next()
    if (subdomain) response.headers.set("x-tenant-subdomain", subdomain)
    return response
  }

  if (isCustomDomain) {
    const response = NextResponse.rewrite(
      new URL(`/storefront${url.pathname}`, request.url)
    )
    response.headers.set("x-custom-domain", hostname.split(":")[0])
    return response
  }

  // Root domain without subdomain
  if (!subdomain || subdomain === "www") {
    if (url.pathname.startsWith("/login") || url.pathname.startsWith("/admin")) {
      return NextResponse.next()
    }
    if (url.pathname === "/" && process.env.NODE_ENV === "production") {
      return NextResponse.rewrite(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  // Admin routes on subdomain
  if (url.pathname.startsWith("/admin")) {
    const response = NextResponse.rewrite(
      new URL(`/storefront${url.pathname}`, request.url)
    )
    if (subdomain) response.headers.set("x-tenant-subdomain", subdomain)
    response.headers.set("x-url", url.pathname)
    return response
  }

  // All other subdomain pages -> /storefront
  const response = NextResponse.rewrite(
    new URL(`/storefront${url.pathname}`, request.url)
  )
  if (subdomain) response.headers.set("x-tenant-subdomain", subdomain)
  return response
}

// ----- Helpers -----
async function checkIfCustomDomain(hostname: string): Promise<boolean> {
  try {
    const host = hostname.split(":")[0]
    if (host.includes("localhost") || host.includes("vercel.app")) return false
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/domains/check?domain=${host}`,
      { headers: { "x-internal-check": "true" } }
    )
    if (!response.ok) return false
    const data = await response.json()
    return data.isCustomDomain === true
  } catch (err) {
    console.error("Error checking custom domain:", err)
    return false
  }
}

function getSubdomain(hostname: string): string | null {
  const host = hostname.split(":")[0]
  if (host.includes("localhost")) {
    const parts = host.split(".")
    if (parts.length > 1 && parts[0] !== "localhost") return parts[0]
    return null
  }
  const parts = host.split(".")
  if (parts.length >= 3) return parts[0]
  return null
}


export default proxy

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}