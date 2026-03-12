"use client"

import {
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Palette,
  Settings,
  Store,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils" // You should have this utility from shadcn/ui

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/customers", icon: Users, label: "Customers" },
  { href: "/dashboard/theme", icon: Palette, label: "Theme" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b p-4">
        <Link href="/dashboard" className={cn("font-bold", isCollapsed && "hidden")}>
          Your Store
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden lg:flex">
          {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </Button>
      </div>
      <nav className="flex-1 space-y-2 p-2">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              title={item.label}
            >
              <item.icon className="mr-2 h-5 w-5" />
              <span className={cn(isCollapsed && "hidden")}>{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t p-4">
         <Link href="/">
             <Button variant="outline" className="w-full justify-start">
                 <Store className="mr-2 h-5 w-5" />
                 <span className={cn(isCollapsed && "hidden")}>View Store</span>
             </Button>
         </Link>
      </div>
    </aside>
  )
}
