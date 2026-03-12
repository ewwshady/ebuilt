"use client"

import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-900 text-white">
        Loading Dashboard...
      </div>
    )
  }

  if (!user || user.role !== "tenant_admin") {
    router.push("/login")
    return null
  }

  return (
    <div className="bg-neutral-900">
      {/* Sidebar is fixed on the left */}
      <DashboardSidebar />

      {/* Main content area scrolls independently */}
      <div className="flex flex-col md:ml-64">
        <DashboardHeader />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
