'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  tenantName?: string;
  cartItemCount: number;
  onSearchChange?: (query: string) => void;
  onCartClick?: () => void;
  onMenuClick?: () => void;
}

export function Header({
  tenantName = 'Store',
  cartItemCount,
  onSearchChange,
  onCartClick,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600" />
            <span className="text-lg font-bold text-gray-900">{tenantName}</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden flex-1 md:flex">
            <div className="relative w-full max-w-sm">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 py-2 text-sm"
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => {
                // Could open a mobile search modal
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
