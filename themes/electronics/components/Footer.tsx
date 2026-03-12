"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";
import type { Tenant } from "@/lib/schemas";

interface FooterProps {
  tenant: Tenant;
}

export function Footer({ tenant }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                <span className="text-lg font-bold">⚡</span>
              </div>
              <h3 className="text-xl font-bold">{tenant.name || "Electronics"}</h3>
            </div>
            <p className="text-sm text-slate-400">
              Your one-stop destination for cutting-edge electronics and gadgets at the best prices.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/laptops" className="hover:text-white transition-colors">
                  Laptops
                </Link>
              </li>
              <li>
                <Link href="/smartphones" className="hover:text-white transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link href="/tablets" className="hover:text-white transition-colors">
                  Tablets
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/warranty" className="hover:text-white transition-colors">
                  Warranty Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+977 1 XXXX XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@electronics.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-700" />

        {/* Bottom */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <p className="text-xs text-slate-500">
            © 2024 {tenant.name || "Electronics"}. All rights reserved.
          </p>
          
          {/* Social */}
          <div className="flex gap-4">
            <Link href="#" className="text-slate-400 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/shipping" className="hover:text-white transition-colors">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
