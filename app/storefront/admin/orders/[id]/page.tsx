"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormCard } from "@/components/admin/FormCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, Loader } from "lucide-react"

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  total: number
}

interface Order {
  _id: string
  orderNumber: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: string
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
  createdAt: string
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/tenants/orders/${id}`)
        if (!response.ok) throw new Error("Failed to fetch order")

        const data = await response.json()
        setOrder(data.order)
      } catch (error) {
        console.error("Error fetching order:", error)
        toast.error("Failed to load order")
        router.push("/admin/orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id, router])

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return

    setSaving(true)
    try {
      const response = await fetch(`/api/tenants/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) throw new Error("Failed to update order")

      setOrder({ ...order, status: newStatus as any })
      toast.success("Order status updated")
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Failed to update order")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-gray-600 mt-1">Order details and status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <FormCard title="Order Items">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${item.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </FormCard>

          {/* Shipping Address */}
          <FormCard title="Shipping Address">
            <div className="space-y-2 text-gray-700">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </FormCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <FormCard title="Order Status">
            <div className="space-y-4">
              <Select value={order.status} onValueChange={handleStatusChange} disabled={saving}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FormCard>

          {/* Order Summary */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <FormCard title="Payment Information">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : order.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                <p className="font-medium text-gray-900">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Order Date</p>
                <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </FormCard>

          {/* Customer */}
          <FormCard title="Customer">
            <div>
              <p className="text-sm text-gray-600 mb-2">Email</p>
              <a href={`mailto:${order.customerEmail}`} className="text-blue-600 hover:underline font-medium">
                {order.customerEmail}
              </a>
            </div>
          </FormCard>
        </div>
      </div>
    </div>
  )
}
