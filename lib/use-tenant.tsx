"use client"

import { useState, useEffect } from "react"
import type { Tenant } from "@/lib/schemas"

export function useTenant() {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await fetch("/api/storefront/tenant")
        if (!response.ok) {
          throw new Error("Failed to fetch tenant")
        }
        const data = await response.json()
        setTenant(data.tenant)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tenant")
      } finally {
        setLoading(false)
      }
    }

    fetchTenant()
  }, [])

  return { tenant, loading, error }
}