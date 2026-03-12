"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/admin/DataTable"
import { Search } from "lucide-react"
import { toast } from "sonner"

interface Customer {
  _id: string
  email: string
  name?: string
  createdAt: string
  profile?: {
    phone?: string
    address?: {
      city?: string
      country?: string
    }
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const LIMIT = 10

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(LIMIT),
          ...(search && { search }),
        })

        const response = await fetch(`/api/tenants/customers?${query}`)
        if (!response.ok) throw new Error("Failed to fetch customers")

        const data = await response.json()
        setCustomers(data.customers)
        setTotal(data.pagination.total)
      } catch (error) {
        console.error("Error fetching customers:", error)
        toast.error("Failed to load customers")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [page, search])

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value: string | undefined) => <span className="font-medium">{value || "N/A"}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (value: string) => <span className="text-gray-700">{value}</span>,
    },
    {
      key: "profile",
      label: "Phone",
      render: (value: any) => <span className="text-gray-700">{value?.phone || "N/A"}</span>,
    },
    {
      key: "profile",
      label: "Location",
      render: (value: any) => (
        <span className="text-gray-700">
          {value?.address?.city && value?.address?.country
            ? `${value.address.city}, ${value.address.country}`
            : "N/A"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage your store customers</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable<Customer>
        columns={columns}
        data={customers}
        isLoading={loading}
        emptyMessage="No customers found"
        pagination={{
          total,
          page,
          pageSize: LIMIT,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}
