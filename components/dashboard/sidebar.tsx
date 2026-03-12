"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Palette,
  Settings,
  Star,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/customers", icon: Users, label: "Customers" },
  { href: "/dashboard/reviews", icon: Star, label: "Reviews" },
  { href: "/dashboard/theme", icon: Palette, label: "Theme" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col justify-between border-r border-neutral-800 bg-[#1A1A1A] p-4 text-neutral-300 md:flex">
      {/* Brand & Navigation */}
      <div>
        {/* Brand */}
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-white">Your Store</h1>
          <p className="text-xs text-neutral-400">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-700/50",
                  isActive ? "text-amber-400" : "hover:text-white"
                )}
              >
                {/* Active link indicator */}
                {isActive && (
                  <span className="absolute -left-4 h-full w-1 rounded-r-full bg-amber-400" />
                )}
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom subtle footer */}
      <div className="px-2 text-xs text-neutral-500">
        © {new Date().getFullYear()} Your Store
      </div>
    </aside>
  )
}
