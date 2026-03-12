import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/session"

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    const session = await verifyToken(token)
    if (!session || session.role !== "tenant_admin") {
      return NextResponse.json({ error: "Forbidden - Tenant admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 })
    }

    if (!ObjectId.isValid(tenantId)) {
      return NextResponse.json({ error: "Invalid tenant ID format" }, { status: 400 })
    }

    if (session.tenantId !== tenantId) {
      return NextResponse.json({ error: "Forbidden - Cannot access another tenant's analytics" }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db("ebuilt")

    const tenantObjectId = new ObjectId(tenantId)

    const [orders, products, reviews] = await Promise.all([
      db.collection("orders").find({ tenantId: tenantObjectId }).toArray(),
      db.collection("products").find({ tenantId: tenantObjectId }).toArray(),
      db.collection("reviews").find({ tenantId: tenantObjectId, status: "approved" }).toArray(),
    ])

    // Get order statistics
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order: any) => sum + (order.total || 0), 0)
    const pendingOrders = orders.filter((order: any) => order.status === "pending").length
    const completedOrders = orders.filter((order: any) => order.status === "completed").length

    // Get product statistics
    const totalProducts = products.length
    const activeProducts = products.filter((product: any) => product.status === "active").length

    // Get review statistics
    const totalReviews = reviews.length
    const averageRating =
      reviews.length > 0
        ? Math.round((reviews.reduce((sum, review: any) => sum + (review.rating || 0), 0) / reviews.length) * 10) / 10
        : 0

    // Calculate last 7 days revenue
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentOrders = orders.filter((order: any) => new Date(order.createdAt) >= sevenDaysAgo)
    const recentRevenue = recentOrders.reduce((sum, order: any) => sum + (order.total || 0), 0)

    // Calculate last 30 days data for chart
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
      })
    }

    // Top products by revenue
    const productRevenue: any = {}
    orders.forEach((order: any) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const productId = item.productId?.toString()
          if (productId) {
            if (!productRevenue[productId]) {
              productRevenue[productId] = {
                productId,
                name: item.name || "Unknown Product",
                revenue: 0,
                quantity: 0,
              }
            }
            productRevenue[productId].revenue += item.total || 0
            productRevenue[productId].quantity += item.quantity || 0
          }
        })
      }
    })

    const topProducts = Object.values(productRevenue)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((product: any) => ({
        ...product,
        revenue: Math.round(product.revenue * 100) / 100,
      }))

    return NextResponse.json({
      analytics: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders,
        completedOrders,
        totalProducts,
        activeProducts,
        totalReviews,
        averageRating,
        recentRevenue: Math.round(recentRevenue * 100) / 100,
        dailyRevenue,
        topProducts,
      },
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analytics" },
      { status: 500 },
    )
  }
}
