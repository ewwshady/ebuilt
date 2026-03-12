"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Search, User, Heart, Menu, X } from "lucide-react"
import { useState } from "react"

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "Home", href: "/storefront" },
    { label: "Products", href: "/storefront/products" },
    { label: "Collections", href: "/storefront/collections" },
    { label: "About", href: "/storefront/about" },
    { label: "Contact", href: "/storefront/contact" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="font-bold text-2xl text-slate-900">
              eBuild
            </Link>

            {/* Search Bar - Hidden on Mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="w-full relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 border-slate-300 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="hidden sm:inline-flex p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-slate-900">
                <Heart size={20} />
              </button>
              <Link href="/login">
                <button className="hidden sm:inline-flex p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-slate-900">
                  <User size={20} />
                </button>
              </Link>
              <Link href="/storefront/cart" className="relative">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-slate-900">
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    0
                  </span>
                </button>
              </Link>

              {/* Mobile Menu */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 py-4 border-t border-slate-200">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-700 hover:text-slate-900 font-medium transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2 border-t border-slate-200">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/login" className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">
                Sign In
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/storefront/products" className="hover:text-white transition">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/storefront/collections" className="hover:text-white transition">
                    Collections
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/storefront/contact" className="hover:text-white transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/storefront/faq" className="hover:text-white transition">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/storefront/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/storefront/terms" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/storefront/about" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/storefront" className="hover:text-white transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2024 eBuild Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
