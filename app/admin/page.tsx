"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Revenue",
      value: "Rs. 45,231.89",
      change: "+20.1%",
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Orders",
      value: "1,234",
      change: "+15%",
      icon: ShoppingBag,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Total Products",
      value: "86",
      change: "+5 this month",
      icon: Package,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Active Customers",
      value: "549",
      change: "+12%",
      icon: Users,
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your store performance overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                      <ArrowUpRight size={14} />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Revenue Overview</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
              [Chart Placeholder - Add Recharts here]
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Top Products</CardTitle>
            <CardDescription>By sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Product A", "Product B", "Product C"].map((product, idx) => (
                <div key={idx} className="flex items-center justify-between pb-3 border-b border-slate-800 last:border-0">
                  <span className="text-sm text-slate-300">{product}</span>
                  <span className="text-sm font-semibold text-white">₹{(idx + 1) * 1000}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Recent Orders</CardTitle>
            <CardDescription>Your latest orders</CardDescription>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">View All Orders</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-300">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono text-white">#ORD-{1000 + i}</td>
                    <td className="py-3 px-4">Customer {i}</td>
                    <td className="py-3 px-4">Rs. {Math.random() * 5000}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">Today</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
