import { StatsCard } from "@/components/admin/StatsCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTenantFromSubdomainHeader } from "@/lib/tenant-admin"
import { getAdminSession } from "@/lib/admin-auth"
import { getDb } from "@/lib/mongodb" // Switched to the central utility
import { ObjectId } from "mongodb"
import type { Order, Product, Review } from "@/lib/schemas"

async function getStatistics(tenantId: ObjectId) {
  try {
    const db = await getDb()
    
    const [totalProducts, totalOrders, totalCustomers, totalReviews] = await Promise.all([
      db.collection<Product>("products").countDocuments({ tenantId }),
      db.collection<Order>("orders").countDocuments({ tenantId }),
      db.collection("users").countDocuments({ tenantId, role: "customer" }),
      db.collection<Review>("reviews").countDocuments({ tenantId }),
    ])

    const revenueResult = await db
      .collection<Order>("orders")
      .aggregate([
        { $match: { tenantId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ])
      .toArray()

    return {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalReviews,
      totalRevenue: revenueResult[0]?.total || 0,
    }
  } catch (error) {
    console.error("[dashboard stats] Error:", error)
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalReviews: 0,
      totalRevenue: 0,
    }
  }
}

async function getRecentOrders(tenantId: ObjectId) {
  try {
    const db = await getDb()
    const orders = await db
      .collection<Order>("orders")
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    return orders.map((order) => ({
      id: order._id!.toString(),
      orderNumber: order.orderNumber,
      customer: order.customerEmail,
      total: order.total,
      status: order.status,
      // Robust date handling to prevent .toLocaleDateString is not a function
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A",
    }))
  } catch (error) {
    console.error("[dashboard orders] Error:", error)
    return []
  }
}

export default async function AdminDashboard() {
  const session = await getAdminSession()
  const tenant = await getTenantFromSubdomainHeader()

  if (!session || !tenant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const tenantId = new ObjectId(session.tenantId)
  const [stats, recentOrders] = await Promise.all([
    getStatistics(tenantId),
    getRecentOrders(tenantId),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back to {tenant.name}! Here's your store overview.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          label="Products"
          value={stats.totalProducts}
          icon="📦"
          href="/admin/products"
        />
        <StatsCard
          label="Orders"
          value={stats.totalOrders}
          icon="🛒"
          href="/admin/orders"
        />
        <StatsCard
          label="Customers"
          value={stats.totalCustomers}
          icon="👥"
          href="/admin/customers"
        />
        <StatsCard
          label="Reviews"
          value={stats.totalReviews}
          icon="⭐"
          href="/admin/reviews"
        />
        <StatsCard
          label="Revenue"
          value={`Rs.${stats.totalRevenue.toFixed(2)}`}
          icon="💰"
          href="/admin/orders"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders List */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest transactions from your store</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No orders found yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">Rs.{order.total.toFixed(2)}</p>
                        <p className={`text-xs font-medium ${
                          order.status === "completed" ? "text-green-600" : 
                          order.status === "pending" ? "text-yellow-600" : "text-gray-600"
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <a href="/admin/products/new" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group">
                  <p className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</p>
                  <p className="text-xs font-medium text-gray-900">Add Product</p>
                </a>
                <a href="/admin/themes" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group">
                  <p className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎨</p>
                  <p className="text-xs font-medium text-gray-900">Customize</p>
                </a>
                <a href="/admin/settings" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group">
                  <p className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</p>
                  <p className="text-xs font-medium text-gray-900">Settings</p>
                </a>
                <a href="/admin/orders" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center group">
                  <p className="text-2xl mb-2 group-hover:scale-110 transition-transform">📋</p>
                  <p className="text-xs font-medium text-gray-900">Orders</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
