// app/storefront/admin/layout.tsx

import type React from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers" // 1. Add this import
import { getAdminSession } from "@/lib/admin-auth"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Tenant } from "@/lib/schemas"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 2. Get the pathname from the middleware header
  const headersList = await headers()
  const pathname = headersList.get("x-url") || ""
  const isLoginPage = pathname.endsWith("/login")

  // 3. Check session
  const session = await getAdminSession()

  // 4. If no session AND not on login page, redirect
  if (!session && !isLoginPage) {
    redirect("/admin/login")
  }

  // 5. If it IS the login page, return just the children (no sidebar/header)
  // This prevents the login page from having a broken sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // --- Rest of your existing logic (now safe because session exists) ---
  let storeName = "Store"
  try {
    const client = await clientPromise
    const db = client.db("ebuilt")
    const tenant = await db
      .collection<Tenant>("tenants")
      .findOne({ _id: new ObjectId(session.tenantId) })
    if (tenant) {
      storeName = tenant.name
    }
  } catch (error) {
    console.error("[admin layout] Error fetching tenant:", error)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar storeName={storeName} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader userName={session.name} userEmail={session.email} />
        <div className="h-16 lg:h-0" />
        <main className="flex-1 overflow-auto p-4 lg:p-8 ml-0 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
