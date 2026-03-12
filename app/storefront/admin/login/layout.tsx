import type React from "react"

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  // Login page doesn't need authentication check
  // Just render the children without the admin layout
  return children
}
