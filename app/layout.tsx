// app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/use-auth"
import "./globals.css"

// --- 1. IMPORT THE PROVIDER AND TOASTER ---
import { CartProvider } from "@/lib/use-cart";
import { Toaster } from "sonner";

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Multi-Tenant E-Commerce Platform",
  // ... your other metadata
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {/* --- 2. WRAP EVERYTHING IN THE CART PROVIDER --- */}
          <CartProvider>
            {children}
            {/* --- 3. PLACE THE TOASTER HERE SO IT'S AVAILABLE GLOBALLY --- */}
            <Toaster richColors position="top-right" />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
