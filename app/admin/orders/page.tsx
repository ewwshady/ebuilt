"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Eye, Download, Filter } from "lucide-react"

export default function OrdersPage() {
  const [orders] = useState([
    {
      id: "ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      items: 3,
      total: 2197,
      status: "completed",
      date: "2024-03-12",
      paymentMethod: "COD",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      items: 1,
      total: 1599,
      status: "processing",
      date: "2024-03-11",
      paymentMethod: "eSewa",
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson",
      email: "bob@example.com",
      items: 2,
      total: 1799,
      status: "pending",
      date: "2024-03-10",
      paymentMethod: "Khalti",
    },
    {
      id: "ORD-004",
      customer: "Alice Williams",
      email: "alice@example.com",
      items: 5,
      total: 3499,
      status: "completed",
      date: "2024-03-09",
      paymentMethod: "COD",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "processing":
        return "bg-blue-500/20 text-blue-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "cancelled":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-slate-400 mt-1">Manage all customer orders</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Download size={18} />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <Input
            placeholder="Search orders by ID, customer, or email..."
            className="pl-10 bg-slate-900 border-slate-800 text-white"
          />
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300 gap-2">
          <Filter size={18} />
          Filter
        </Button>
      </div>

      {/* Orders Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">All Orders</CardTitle>
          <CardDescription>{orders.length} total orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700">
                <tr className="text-slate-400">
                  <th className="text-left py-4 px-4">Order ID</th>
                  <th className="text-left py-4 px-4">Customer</th>
                  <th className="text-left py-4 px-4">Items</th>
                  <th className="text-left py-4 px-4">Total</th>
                  <th className="text-left py-4 px-4">Status</th>
                  <th className="text-left py-4 px-4">Payment</th>
                  <th className="text-left py-4 px-4">Date</th>
                  <th className="text-left py-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                    <td className="py-4 px-4">
                      <span className="font-mono text-white font-semibold">{order.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white">{order.customer}</p>
                        <p className="text-xs text-slate-400">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{order.items} items</td>
                    <td className="py-4 px-4 text-white font-semibold">Rs. {order.total}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300 text-xs">{order.paymentMethod}</td>
                    <td className="py-4 px-4 text-slate-400 text-sm">{order.date}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-sm mb-2">Total Orders</p>
            <p className="text-2xl font-bold text-white">{orders.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-sm mb-2">Total Revenue</p>
            <p className="text-2xl font-bold text-white">Rs. {orders.reduce((sum, o) => sum + o.total, 0)}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-sm mb-2">Pending Orders</p>
            <p className="text-2xl font-bold text-yellow-400">{orders.filter(o => o.status === "pending").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-sm mb-2">Completed</p>
            <p className="text-2xl font-bold text-green-400">{orders.filter(o => o.status === "completed").length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
