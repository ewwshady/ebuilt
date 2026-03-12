import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/session"

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    const session = await verifyToken(token)
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden - Super admin access required" }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const [tenants, orders, products, users, reviews] = await Promise.all([
      db.collection("tenants").find({}).toArray(),
      db.collection("orders").find({}).toArray(),
      db.collection("products").find({}).toArray(),
      db.collection("users").find({}).toArray(),
      db.collection("reviews").find({}).toArray(),
    ])

    // Overall statistics
    const totalTenants = tenants.length
    const activeTenants = tenants.filter((t: any) => t.status === "active").length
    const suspendedTenants = tenants.filter((t: any) => t.status === "suspended").length
    const totalRevenue = orders.reduce((sum, order: any) => sum + (order.total || 0), 0)
    const totalOrders = orders.length
    const totalProducts = products.length
    const totalUsers = users.length
    const totalCustomers = users.filter((u: any) => u.role === "customer").length
    const totalReviews = reviews.length

    // Revenue by tenant
    const revenueByTenant: any = {}
    orders.forEach((order: any) => {
      const tenantId = order.tenantId?.toString()
      if (tenantId) {
        if (!revenueByTenant[tenantId]) {
          revenueByTenant[tenantId] = {
            tenantId,
            revenue: 0,
            orders: 0,
          }
        }
        revenueByTenant[tenantId].revenue += order.total || 0
        revenueByTenant[tenantId].orders += 1
      }
    })

    // Add tenant names
    const topTenants = Object.values(revenueByTenant)
      .map((item: any) => {
        const tenant = tenants.find((t: any) => t._id.toString() === item.tenantId)
        return {
          ...item,
          name: tenant?.name || "Unknown",
          subdomain: tenant?.subdomain || "unknown",
          revenue: Math.round(item.revenue * 100) / 100,
        }
      })
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10)

    // Last 30 days revenue
    const dailyRevenue = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= date && orderDate < nextDate
      })

      const dayRevenue = dayOrders.reduce((sum, order: any) => sum + (order.total || 0), 0)

      dailyRevenue.push({
        date: date.toISOString().split("T")[0],
        revenue: Math.round(dayRevenue * 100) / 100,
        orders: dayOrders.length,
        newTenants: tenants.filter((t: any) => {
          const createdDate = new Date(t.createdAt)
          return createdDate >= date && createdDate < nextDate
        }).length,
      })
    }

    // Plan distribution
    const planDistribution = tenants.reduce((acc: any, tenant: any) => {
      acc[tenant.plan] = (acc[tenant.plan] || 0) + 1
      return acc
    }, {})

    // Recent activities
    const recentTenants = tenants
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((t: any) => ({
        _id: t._id,
        name: t.name,
        subdomain: t.subdomain,
        status: t.status,
        plan: t.plan,
        createdAt: t.createdAt,
      }))

    return NextResponse.json({
      analytics: {
        totalTenants,
        activeTenants,
        suspendedTenants,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        totalUsers,
        totalCustomers,
        totalReviews,
        topTenants,
        dailyRevenue,
        planDistribution,
        recentTenants,
      },
    })
  } catch (error) {
    console.error("Super admin analytics error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analytics" },
      { status: 500 },
    )
  }
}
