"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import type { Order } from "@/lib/schemas"

interface OrderTableProps {
  orders: Order[]
  onUpdate: () => void
}

export function OrderTable({ orders, onUpdate }: OrderTableProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusChange = async (orderId: string, status: string) => {
    setLoading(orderId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error("Update order error:", error)
    } finally {
      setLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "processing":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return ""
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "failed":
      case "refunded":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return ""
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No orders yet</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id?.toString()}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                </div>
              </TableCell>
              <TableCell>{order.items.length} items</TableCell>
              <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={loading === order._id?.toString()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(order._id!.toString(), "processing")}>
                      Mark as Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order._id!.toString(), "completed")}>
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(order._id!.toString(), "cancelled")}
                      className="text-red-600"
                    >
                      Cancel Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
