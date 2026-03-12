"use client"

import { Search, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CartDrawer } from "./cart-drawer"
import type { Tenant } from "@/lib/schemas"
import Link from "next/link"
import { useState, useEffect } from "react"

interface StorefrontHeaderProps {
  tenant: Tenant
}

export function StorefrontHeader({ tenant }: StorefrontHeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        setIsLoggedIn(response.ok)
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const logo = tenant.themeOverrides?.logo || tenant.theme?.logo
  const name = tenant.themeOverrides?.name || tenant.name
  const description = tenant.themeOverrides?.description || tenant.description

  const navLinks = tenant.themeOverrides?.headerLinks || [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo & Name */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {logo ? (
              <img src={logo} alt={name} className="h-10 w-10 object-contain rounded-lg" />
            ) : (
              <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold bg-gray-700">
                {name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{name}</h1>
              {description && <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>}
            </div>
          </Link>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 max-w-md">
              <Input placeholder="Search products..." className="w-64" />
              <Button size="icon" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/storefront/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/storefront/profile">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/storefront/auth/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}

            <CartDrawer />
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t py-3">
          <ul className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary transition-colors font-medium">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
