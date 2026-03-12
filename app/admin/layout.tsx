"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Users,
  Palette,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Themes", href: "/admin/themes", icon: Palette },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-slate-900 border-r border-slate-800 overflow-y-auto transition-all",
          !sidebarOpen && "w-20"
        )}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h1 className={cn("font-bold text-white text-lg", !sidebarOpen && "hidden")}>
              eBuild
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-slate-800 rounded"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-slate-700 text-slate-400 hover:bg-slate-800"
          >
            <LogOut size={18} />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
              <Bell size={20} />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-auto bg-slate-950">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
