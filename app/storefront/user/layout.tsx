import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { User, Package, MapPin, Settings, LogOut, LucideMove3D, HeartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  // 1. Protect Route: Must be logged in AND a customer
  if (!session || session.role !== "customer") {
    redirect("/auth/login")
  }

  const navItems = [
    { label: "Overview", href: "/user", icon: User },
    { label: "My Orders", href: "/user/orders", icon: Package },
    { label: "Profile & Addresses", href: "/user/profile", icon: MapPin },
     { label: "Saved Products", href: "/user/wishlist", icon: HeartIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-xl text-gray-900">My Account</h2>
          <p className="text-xs text-gray-500 mt-1">{session.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="h-5 w-5 mr-3" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
