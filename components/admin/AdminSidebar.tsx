"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Palette,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const ADMIN_ROUTES = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Themes", href: "/admin/themes", icon: Palette },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
  storeName?: string
}

export function AdminSidebar({ storeName = "Store" }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/tenants/auth/logout", { method: "POST" })
      window.location.href = "/admin/login"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 right-0 z-40 lg:hidden bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold truncate">{storeName}</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 h-full w-64 bg-slate-900 text-white overflow-y-auto transition-transform duration-300 lg:translate-x-0 pt-6 lg:pt-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo section */}
        <div className="px-6 py-4 border-b border-slate-700 hidden lg:block mb-6">
          <h1 className="text-xl font-bold">{storeName}</h1>
          <p className="text-xs text-slate-400 mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {ADMIN_ROUTES.map((route) => {
            const Icon = route.icon
            const isActive = pathname === route.href || pathname.startsWith(route.href + "/")

            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{route.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Button
            variant="outline"
            className="w-full text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
