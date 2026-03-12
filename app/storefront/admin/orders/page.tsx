"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/admin/DataTable"
import { Eye } from "lucide-react"
import { toast } from "sonner"

interface Order {
  _id: string
  orderNumber: string
  customerEmail: string
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  
  // Changed "" to "all" to fix Radix UI value error
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 10

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const queryParams: Record<string, string> = {
          page: String(page),
          limit: String(LIMIT),
        }

        // Only add status to query if a specific filter is selected
        if (status !== "all") {
          queryParams.status = status
        }

        const query = new URLSearchParams(queryParams)
        const response = await fetch(`/api/tenants/orders?${query}`)
        
        if (!response.ok) throw new Error("Failed to fetch orders")
        
        const data = await response.json()
        setOrders(data.orders)
        setTotal(data.pagination.total)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast.error("Failed to load orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [page, status])

  const columns = [
    {
      key: "orderNumber",
      label: "Order Number",
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "customerEmail",
      label: "Customer",
      render: (value: string) => <span className="text-gray-700">{value}</span>,
    },
    {
      key: "total",
      label: "Amount",
      render: (value: number) => <span className="font-semibold">${value.toFixed(2)}</span>,
    },
    {
      key: "status",
      label: "Order Status",
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            value === "completed"
              ? "bg-green-100 text-green-800"
              : value === "processing"
                ? "bg-blue-100 text-blue-800"
                : value === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            value === "paid"
              ? "bg-green-100 text-green-800"
              : value === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
            <Select 
              value={status} 
              onValueChange={(value) => {
                setStatus(value)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                {/* Changed value="" to value="all" */}
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setStatus("all") // Changed from ""
              setPage(1)
            }}
          >
            Clear Filter
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable<Order>
        columns={columns}
        data={orders}
        isLoading={loading}
        emptyMessage="No orders found"
        pagination={{
          total,
          page,
          pageSize: LIMIT,
          onPageChange: setPage,
        }}
        actions={(row) => (
          <Link href={`/admin/orders/${row._id}`}>
            <Button variant="outline" size="sm" className="text-blue-600">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        )}
      />
    </div>
  )
}
