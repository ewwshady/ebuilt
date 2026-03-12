import { getDb } from "./mongodb"
import { ObjectId } from "mongodb"
import { subDays } from "date-fns"

export interface SuperAdminAnalytics {
  // Platform Stats
  totalTenants: number
  activeTenants: number
  inactiveTenants: number
  suspendedTenants: number
  
  // Revenue Metrics
  totalPlatformRevenue: number
  recentRevenue: number
  revenueByPlan: {
    plan: string
    revenue: number
    tenantCount: number
  }[]
  
  // Order Metrics
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  totalOrderValue: number
  avgOrderValue: number
  
  // Customer Metrics
  totalCustomers: number
  activeCustomers: number
  newCustomersThisMonth: number
  
  // Product Metrics
  totalProducts: number
  activeProducts: number
  totalCategories: number
  
  // Payment Metrics
  paymentMethodStats: {
    method: string
    count: number
    revenue: number
    successRate: number
  }[]
  
  // Top Performers
  topTenants: {
    tenantId: string
    tenantName: string
    revenue: number
    orders: number
    customers: number
    rating: number
  }[]
  
  topCategories: {
    category: string
    revenue: number
    products: number
    orders: number
  }[]
  
  // Engagement Metrics
  avgRating: number
  totalReviews: number
  reviewApprovalRate: number
  
  // Charts
  dailyRevenue: {
    date: string
    revenue: number
  }[]
  
  tenantGrowth: {
    date: string
    count: number
  }[]
  
  revenueByCategory: {
    category: string
    revenue: number
  }[]
  
  // Health Indicators
  systemHealth: {
    dbHealth: "healthy" | "warning" | "critical"
    responseTime: number
    errorRate: number
  }
}

export async function getSuperAdminAnalytics(): Promise<SuperAdminAnalytics> {
  const db = await getDb()
  
  const now = new Date()
  const sevenDaysAgo = subDays(now, 7)
  const thirtyDaysAgo = subDays(now, 30)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    tenantStats,
    revenueStats,
    revenueByPlan,
    orderStats,
    customerStats,
    newCustomers,
    productStats,
    paymentStats,
    topTenants,
    topCategories,
    reviewStats,
    dailyRevenue,
    tenantGrowth,
    revenueByCategory,
  ] = await Promise.all([
    // Tenant Stats
    db.collection("tenants").aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
          suspended: { $sum: { $cond: [{ $eq: ["$status", "suspended"] }, 1, 0] } },
        },
      },
    ]).toArray(),

    // Total Revenue (All time)
    db.collection("orders").aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).toArray(),

    // Revenue by Plan
    db.collection("tenants").aggregate([
      {
        $group: {
          _id: "$plan",
          revenue: { $sum: 1 }, // Placeholder - in real system, sum subscription revenue
          tenantCount: { $sum: 1 },
        },
      },
      { $project: { plan: "$_id", revenue: 1, tenantCount: 1, _id: 0 } },
    ]).toArray(),

    // Order Stats
    db.collection("orders").aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          totalValue: { $sum: "$total" },
          avgValue: { $avg: "$total" },
        },
      },
    ]).toArray(),

    // Customer Stats
    db.collection("users").aggregate([
      { $match: { role: "customer" } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
        },
      },
    ]).toArray(),

    // New Customers This Month
    db.collection("users").aggregate([
      { $match: { role: "customer", createdAt: { $gte: monthStart } } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]).toArray(),

    // Product Stats
    db.collection("products").aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          categories: { $sum: 1 },
        },
      },
    ]).toArray(),

    // Payment Method Stats
    db.collection("orders").aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$total" },
          successRate: { $avg: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] } },
        },
      },
      { $project: { method: "$_id", count: 1, revenue: 1, successRate: 1, _id: 0 } },
    ]).toArray(),

    // Top 5 Tenants
    db.collection("orders").aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: "$tenantId",
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "tenants",
          localField: "_id",
          foreignField: "_id",
          as: "tenant",
        },
      },
      {
        $project: {
          tenantId: "$_id",
          tenantName: { $arrayElemAt: ["$tenant.name", 0] },
          revenue: 1,
          orders: 1,
          customers: 1,
          rating: 4.5,
          _id: 0,
        },
      },
    ]).toArray(),

    // Top Categories
    db.collection("orders").aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $group: {
          _id: { $arrayElemAt: ["$product.category", 0] },
          revenue: { $sum: "$items.total" },
          products: { $sum: 1 },
          orders: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $project: { category: "$_id", revenue: 1, products: 1, orders: 1, _id: 0 } },
    ]).toArray(),

    // Review Stats
    db.collection("reviews").aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]).toArray(),

    // Daily Revenue (last 30 days)
    db.collection("orders").aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", revenue: 1, _id: 0 } },
    ]).toArray(),

    // Tenant Growth (last 30 days)
    db.collection("tenants").aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", count: 1, _id: 0 } },
    ]).toArray(),

    // Revenue by Category
    db.collection("orders").aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $group: {
          _id: { $arrayElemAt: ["$product.category", 0] },
          revenue: { $sum: "$items.total" },
        },
      },
      { $sort: { revenue: -1 } },
      { $project: { category: "$_id", revenue: 1, _id: 0 } },
    ]).toArray(),
  ])

  // Calculate review approval rate
  const totalReviews = await db.collection("reviews").countDocuments()
  const approvedReviews = reviewStats[0]?.totalReviews || 0
  const reviewApprovalRate = totalReviews > 0 ? (approvedReviews / totalReviews) * 100 : 0

  return {
    // Tenant Stats
    totalTenants: tenantStats[0]?.total || 0,
    activeTenants: tenantStats[0]?.active || 0,
    inactiveTenants: tenantStats[0]?.inactive || 0,
    suspendedTenants: tenantStats[0]?.suspended || 0,

    // Revenue
    totalPlatformRevenue: revenueStats[0]?.total || 0,
    recentRevenue: (await db.collection("orders").aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).toArray())[0]?.total || 0,
    revenueByPlan: revenueByPlan as any,

    // Orders
    totalOrders: orderStats[0]?.total || 0,
    completedOrders: orderStats[0]?.completed || 0,
    pendingOrders: orderStats[0]?.pending || 0,
    totalOrderValue: orderStats[0]?.totalValue || 0,
    avgOrderValue: orderStats[0]?.avgValue || 0,

    // Customers
    totalCustomers: customerStats[0]?.total || 0,
    activeCustomers: customerStats[0]?.active || 0,
    newCustomersThisMonth: newCustomers[0]?.count || 0,

    // Products
    totalProducts: productStats[0]?.total || 0,
    activeProducts: productStats[0]?.active || 0,
    totalCategories: (revenueByCategory as any).length,

    // Payment Methods
    paymentMethodStats: paymentStats as any,

    // Top Performers
    topTenants: topTenants as any,
    topCategories: topCategories as any,

    // Engagement
    avgRating: reviewStats[0]?.avgRating || 0,
    totalReviews: approvedReviews,
    reviewApprovalRate,

    // Charts
    dailyRevenue: dailyRevenue as any,
    tenantGrowth: tenantGrowth as any,
    revenueByCategory: revenueByCategory as any,

    // Health (placeholder)
    systemHealth: {
      dbHealth: "healthy",
      responseTime: 45,
      errorRate: 0.02,
    },
  }
}
