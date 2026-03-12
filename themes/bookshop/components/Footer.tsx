"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import type { Tenant } from "@/lib/schemas";

interface FooterProps {
  tenant: Tenant;
}

export function Footer({ tenant }: FooterProps) {
  return (
    <footer className="border-t border-amber-200 bg-amber-950 text-amber-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h3 className="text-xl font-bold">{tenant.name || "Bookshop"}</h3>
            </div>
            <p className="text-sm text-amber-100">
              Discover your next favorite book from our curated collection of timeless classics and contemporary bestsellers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop All Books
                </Link>
              </li>
              <li>
                <Link href="/bestsellers" className="hover:text-white transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/fiction" className="hover:text-white transition-colors">
                  Fiction
                </Link>
              </li>
              <li>
                <Link href="/non-fiction" className="hover:text-white transition-colors">
                  Non-Fiction
                </Link>
              </li>
              <li>
                <Link href="/biography" className="hover:text-white transition-colors">
                  Biography
                </Link>
              </li>
              <li>
                <Link href="/children" className="hover:text-white transition-colors">
                  Children's Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+977 1 XXXX XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@bookshop.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-amber-800" />

        {/* Bottom */}
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <p className="text-xs text-amber-200">
            © 2024 {tenant.name || "Bookshop"}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping" className="hover:text-white transition-colors">
              Shipping Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
