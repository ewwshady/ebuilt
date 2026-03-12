"use client";

import { Search, Heart, ShoppingCart, User, Zap } from "lucide-react";
import Link from "next/link";
import type { Tenant } from "@/lib/schemas";

interface HeaderProps {
  tenant: Tenant;
}

export function Header({ tenant }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <Link href="/" className="text-2xl font-bold text-gray-900">
              {tenant.name || "Electronics"}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden flex-1 items-center gap-4 px-8 md:flex">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 pl-10 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
            <button className="relative text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                0
              </span>
            </button>
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className="flex gap-8 border-t border-slate-100 py-3 text-sm">
          <Link href="/shop" className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            All Products
          </Link>
          <Link href="/laptops" className="text-gray-600 hover:text-blue-600 transition-colors">
            Laptops
          </Link>
          <Link href="/smartphones" className="text-gray-600 hover:text-blue-600 transition-colors">
            Smartphones
          </Link>
          <Link href="/accessories" className="text-gray-600 hover:text-blue-600 transition-colors">
            Accessories
          </Link>
          <Link href="/support" className="text-gray-600 hover:text-blue-600 transition-colors">
            Support
          </Link>
        </nav>
      </div>
    </header>
  );
}
