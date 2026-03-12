"use client"

import { StorefrontHeader } from "@/components/storefront-header"

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontHeader tenant={{ name: "eBuild Store", description: "Premium Products" } as any} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
