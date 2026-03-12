'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  tenantName?: string;
  year?: number;
}

export function Footer({ tenantName = 'Store', year = new Date().getFullYear() }: FooterProps) {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-gray-900">{tenantName}</h3>
            <p className="text-sm text-gray-600">
              Discover premium beauty products curated just for you.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <Link
                href="#"
                className="rounded-lg p-2 hover:bg-gray-200 transition-colors"
              >
                <Facebook className="h-5 w-5 text-gray-600" />
              </Link>
              <Link
                href="#"
                className="rounded-lg p-2 hover:bg-gray-200 transition-colors"
              >
                <Instagram className="h-5 w-5 text-gray-600" />
              </Link>
              <Link
                href="#"
                className="rounded-lg p-2 hover:bg-gray-200 transition-colors"
              >
                <Twitter className="h-5 w-5 text-gray-600" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-pink-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-pink-600">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-pink-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-pink-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-gray-900">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-pink-600">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-pink-600">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-pink-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-pink-600">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-gray-900">Newsletter</h4>
            <p className="text-sm text-gray-600">Subscribe for exclusive offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
            <p className="text-sm text-gray-600">
              &copy; {year} {tenantName}. All rights reserved.
            </p>
            <div className="flex justify-center gap-6 sm:justify-end">
              <Link href="#" className="text-sm text-gray-600 hover:text-pink-600">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-pink-600">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-pink-600">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
