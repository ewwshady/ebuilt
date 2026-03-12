"use client";

import { Search, Heart, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import type { Tenant } from "@/lib/schemas";

interface HeaderProps {
  tenant: Tenant;
}

export function Header({ tenant }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-amber-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-800">
              <span className="text-xl font-bold text-white">📚</span>
            </div>
            <Link href="/" className="text-2xl font-bold text-amber-900">
              {tenant.name || "Bookshop"}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden flex-1 items-center gap-4 px-8 md:flex">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by title, author..."
                className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 pl-10 focus:border-amber-600 focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <button className="text-gray-600 hover:text-amber-600">
              <Heart className="h-5 w-5" />
            </button>
            <button className="relative text-gray-600 hover:text-amber-600">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                0
              </span>
            </button>
            <button className="text-gray-600 hover:text-amber-600">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className="flex gap-8 border-t border-amber-100 py-3 text-sm">
          <Link href="/shop" className="font-medium text-amber-900 hover:text-amber-600">
            All Books
          </Link>
          <Link href="/fiction" className="text-gray-600 hover:text-amber-600">
            Fiction
          </Link>
          <Link href="/non-fiction" className="text-gray-600 hover:text-amber-600">
            Non-Fiction
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-amber-600">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
