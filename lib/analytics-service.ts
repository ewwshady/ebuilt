import { getDb } from "./mongodb"
import { ObjectId } from "mongodb"
import { subDays, startOfDay, endOfDay } from "date-fns"
import type { Order, Product, Review } from "./schemas"

export interface AnalyticsData {
  // Revenue Metrics
  totalRevenue: number
  recentRevenue: number
  revenueChange: number // percentage change
  
  // Order Metrics
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  processingOrders: number
  cancelledOrders: number
  orderConversionRate: number
  
  // Product Metrics
  totalProducts: number
  activeProducts: number
  draftProducts: number
  outOfStockProducts: number
  
  // Customer Metrics
  totalCustomers: number
  newCustomers: number
  repeatCustomers: number
  avgOrderValue: number
  
  // Review & Rating
  averageRating: number
  totalReviews: number
  reviewsThisMonth: number
  
  // Top Performers
  topProducts: {
    productId: string
    name: string
    quantity: number
    revenue: number
    rating?: number
  }[]
  
  topCustomers: {
    customerId: string
    customerName: string
    customerEmail: string
    totalOrders: number
    totalSpent: number
  }[]
  
  // Charts
  dailyRevenue: {
    date: string
    revenue: number
  }[]
  
  dailyOrders: {
    date: string
    orders: number
  }[]
  
  productCategoryDistribution: {
    category: string
    count: number
    revenue: number
  }[]
  
  paymentMethodBreakdown: {
    method: string
    count: number
    revenue: number
  }[]
  
  // Stock alerts
  lowStockProducts: {
    productId: string
    name: string
    currentStock: number
    threshold: number
  }[]
}

export async function getComprehensiveAnalytics(tenantId: string): Promise<AnalyticsData> {
  const db = await getDb()
  const tenantObjectId = new ObjectId(tenantId)
  
  // Date ranges
  const now = new Date()
  const sevenDaysAgo = subDays(now, 7)
  const thirtyDaysAgo = subDays(now, 30)
  const monthStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1))

  // Parallel queries
  const [
    totalRevenueData,
    recentRevenueData,
    previousRevenueData,
    orderStats,
    completedOrdersData,
    productStats,
    customerStats,
    newCustomersData,
    reviewStats,
    topProductsData,
    topCustomersData,
    dailyRevenueData,
    dailyOrdersData,
    categoryDistribution,
    paymentMethodBreakdown,
    lowStockData,
  ] = await Promise.all([
    // Total Revenue
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId, paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).toArray(),

    // Recent Revenue (7 days)
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId, paymentStatus: "paid", createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).toArray(),

    // Previous Revenue (7-14 days ago)
    db.collection<Order>("orders").aggregate([
      { $match: { 
          tenantId: tenantObjectId, 
          paymentStatus: "paid", 
          createdAt: { $gte: subDays(now, 14), $lt: sevenDaysAgo } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).toArray(),

    // Order Status Breakdown
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId } },
      { $group: { 
          _id: null,
          totalOrders: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          processing: { $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
        }},
      ]).toArray(),

    // Average Order Value
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId, paymentStatus: "paid" } },
      { $group: { _id: null, avgValue: { $avg: "$total" }, count: { $sum: 1 } } },
    ]).toArray(),

    // Product Stats
    db.collection<Product>("products").aggregate([
      { $match: { tenantId: tenantObjectId } },
      { $group: { 
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          draftProducts: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
          archivedProducts: { $sum: { $cond: [{ $eq: ["$status", "archived"] }, 1, 0] } },
        }},
    ]).toArray(),

    // Customer Stats
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId } },
      { $group: { _id: "$customerId", orders: { $sum: 1 }, spent: { $sum: "$total" } } },
      { $group: { 
          _id: null,
          totalCustomers: { $sum: 1 },
          repeatCustomers: { $sum: { $cond: [{ $gte: ["$orders", 2] }, 1, 0] } },
        }},
    ]).toArray(),

    // New Customers (this month)
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId, createdAt: { $gte: monthStart } } },
      { $group: { _id: "$customerId" } },
      { $group: { _id: null, newCustomers: { $sum: 1 } } },
    ]).toArray(),

    // Review Stats
    db.collection<Review>("reviews").aggregate([
      { $match: { tenantId: tenantObjectId, status: "approved" } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
    ]).toArray(),

    // Top 5 Products
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId, paymentStatus: "paid" } },
      { $unwind: "$items" },
      { $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.total" }
        }},
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $project: { productId: "$_id", _id: 0, name: 1, quantity: 1, revenue: 1 } }
    ]).toArray(),

    // Top Customers
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId, paymentStatus: "paid" } },
      { $group: {
          _id: "$customerId",
          customerName: { $first: "$customerEmail" },
          customerEmail: { $first: "$customerEmail" },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total" }
        }},
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      { $project: { customerId: "$_id", _id: 0, customerName: 1, customerEmail: 1, totalOrders: 1, totalSpent: 1 } }
    ]).toArray(),

    // Daily Revenue (30 days)
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId, paymentStatus: "paid", createdAt: { $gte: thirtyDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" }
        }},
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", revenue: 1, _id: 0 } }
    ]).toArray(),

    // Daily Orders (30 days)
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 }
        }},
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", orders: 1, _id: 0 } }
    ]).toArray(),

    // Category Distribution
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId, paymentStatus: "paid" } },
      { $unwind: "$items" },
      { $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }},
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $group: {
          _id: { $ifNull: ["$product.category", "Uncategorized"] },
          count: { $sum: 1 },
          revenue: { $sum: "$items.total" }
        }},
      { $sort: { revenue: -1 } },
      { $project: { category: "$_id", count: 1, revenue: 1, _id: 0 } }
    ]).toArray(),

    // Payment Method Breakdown
    db.collection<Order>("orders").aggregate([
      { $match: { tenantId: tenantObjectId, paymentStatus: "paid" } },
      { $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$total" }
        }},
      { $sort: { revenue: -1 } },
      { $project: { method: "$_id", count: 1, revenue: 1, _id: 0 } }
    ]).toArray(),

    // Low Stock Products
    db.collection<Product>("products").aggregate([
      { $match: { 
          tenantId: tenantObjectId,
          status: "active",
          "inventory.trackInventory": true
        }},
      { $match: {
          $expr: { $lte: ["$inventory.quantity", "$inventory.lowStockThreshold"] }
        }},
      { $sort: { "inventory.quantity": 1 } },
      { $limit: 10 },
      { $project: {
          productId: "$_id",
          name: 1,
          currentStock: "$inventory.quantity",
          threshold: "$inventory.lowStockThreshold",
          _id: 0
        }}
    ]).toArray(),
  ])

  // Calculate revenue change percentage
  const currentRevenue = recentRevenueData[0]?.total || 0
  const previousRevenue = previousRevenueData[0]?.total || 0
  const revenueChange = previousRevenue > 0 
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
    : 0

  // Compile analytics
  return {
    // Revenue
    totalRevenue: totalRevenueData[0]?.total || 0,
    recentRevenue: currentRevenue,
    revenueChange,

    // Orders
    totalOrders: orderStats[0]?.totalOrders || 0,
    completedOrders: completedOrdersData[0]?.count || 0,
    pendingOrders: orderStats[0]?.pending || 0,
    processingOrders: orderStats[0]?.processing || 0,
    cancelledOrders: orderStats[0]?.cancelled || 0,
    orderConversionRate: customerStats[0]?.totalCustomers 
      ? ((orderStats[0]?.totalOrders || 0) / customerStats[0].totalCustomers) * 100 
      : 0,

    // Products
    totalProducts: productStats[0]?.totalProducts || 0,
    activeProducts: productStats[0]?.activeProducts || 0,
    draftProducts: productStats[0]?.draftProducts || 0,
    outOfStockProducts: lowStockData.length,

    // Customers
    totalCustomers: customerStats[0]?.totalCustomers || 0,
    newCustomers: newCustomersData[0]?.newCustomers || 0,
    repeatCustomers: customerStats[0]?.repeatCustomers || 0,
    avgOrderValue: completedOrdersData[0]?.avgValue || 0,

    // Reviews
    averageRating: reviewStats[0]?.avgRating || 0,
    totalReviews: reviewStats[0]?.totalReviews || 0,
    reviewsThisMonth: reviewStats[0]?.totalReviews || 0,

    // Top Performers
    topProducts: topProductsData as any,
    topCustomers: topCustomersData as any,

    // Charts
    dailyRevenue: dailyRevenueData as any,
    dailyOrders: dailyOrdersData as any,
    productCategoryDistribution: categoryDistribution as any,
    paymentMethodBreakdown: paymentMethodBreakdown as any,
    lowStockProducts: lowStockData as any,
  }
}
