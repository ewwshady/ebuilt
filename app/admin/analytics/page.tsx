"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, ShoppingBag } from "lucide-react"

export default function AnalyticsPage() {
  const analyticsData = [
    { day: "Mon", revenue: 2400, orders: 24 },
    { day: "Tue", revenue: 1398, orders: 18 },
    { day: "Wed", revenue: 9800, orders: 39 },
    { day: "Thu", revenue: 3908, orders: 28 },
    { day: "Fri", revenue: 4800, orders: 35 },
    { day: "Sat", revenue: 3800, orders: 30 },
    { day: "Sun", revenue: 4300, orders: 25 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Sales and traffic overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-white">Rs. 45,231</p>
                <p className="text-xs text-green-400 mt-2">↑ 20.1% from last week</p>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-white">1,234</p>
                <p className="text-xs text-green-400 mt-2">↑ 15% from last week</p>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <ShoppingBag className="text-purple-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Avg. Order Value</p>
                <p className="text-3xl font-bold text-white">Rs. 1,899</p>
                <p className="text-xs text-green-400 mt-2">↑ 8% from last week</p>
              </div>
              <div className="p-3 bg-green-600/20 rounded-lg">
                <BarChart3 className="text-green-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-2">Active Customers</p>
                <p className="text-3xl font-bold text-white">549</p>
                <p className="text-xs text-green-400 mt-2">↑ 12% from last week</p>
              </div>
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Users className="text-orange-400" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Chart */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Weekly Revenue</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto text-slate-600 mb-2" size={32} />
                <p className="text-slate-500">Revenue chart placeholder</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Breakdown */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Top Products</CardTitle>
            <CardDescription>By revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Premium Lipstick", revenue: 15000, percentage: 35 },
                { name: "Face Serum", revenue: 12000, percentage: 28 },
                { name: "Eye Cream", revenue: 10000, percentage: 23 },
                { name: "Face Cleanser", revenue: 7000, percentage: 14 },
              ].map((product, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">{product.name}</span>
                    <span className="text-white font-semibold">Rs. {product.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${product.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Breakdown */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Daily Overview</CardTitle>
          <CardDescription>Last 7 days breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700">
                <tr className="text-slate-400">
                  <th className="text-left py-3 px-4">Day</th>
                  <th className="text-left py-3 px-4">Revenue</th>
                  <th className="text-left py-3 px-4">Orders</th>
                  <th className="text-left py-3 px-4">Avg. Order Value</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.map((data, idx) => (
                  <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-4 text-white font-medium">{data.day}</td>
                    <td className="py-3 px-4 text-white">Rs. {data.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-300">{data.orders}</td>
                    <td className="py-3 px-4 text-slate-300">Rs. {Math.round(data.revenue / data.orders)}</td>
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
