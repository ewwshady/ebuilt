import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { Order, Product, Review } from "@/lib/schemas";
import { verifyToken } from "@/lib/session";
import { ObjectId } from "mongodb";
import { subDays } from "date-fns";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session || session.role !== 'tenant_admin' || !session.tenantId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const tenantId = new ObjectId(session.tenantId);
    const db = await getDb();
    
    // --- Date Ranges ---
    const sevenDaysAgo = subDays(new Date(), 7);
    const thirtyDaysAgo = subDays(new Date(), 30);

    // --- Parallel Data Fetching ---
    const [
      totalRevenueData,
      recentRevenueData,
      orderStats,
      productStats,
      reviewStats,
      topProductsData,
      dailyRevenueData,
    ] = await Promise.all([
      // Total Revenue (all time)
      db.collection<Order>("orders").aggregate([
        { $match: { tenantId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]).toArray(),

      // Recent Revenue (last 7 days)
      db.collection<Order>("orders").aggregate([
        { $match: { tenantId, status: "completed", createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]).toArray(),
      
      // Order Counts (total and pending)
      db.collection<Order>("orders").aggregate([
        { $match: { tenantId } },
        { $group: { 
            _id: null,
            totalOrders: { $sum: 1 },
            pendingOrders: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } }
        }},
      ]).toArray(),

      // Product Counts (total and active)
      db.collection<Product>("products").aggregate([
        { $match: { tenantId } },
        { $group: { 
            _id: null,
            totalProducts: { $sum: 1 },
            activeProducts: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } }
        }},
      ]).toArray(),

      // Review stats
      db.collection<Review>("reviews").aggregate([
        { $match: { tenantId, status: "approved" } },
        { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]).toArray(),
      
      // Top 5 selling products
      db.collection<Order>("orders").aggregate([
        { $match: { tenantId, status: "completed" } },
        { $unwind: "$items" },
        { $group: {
            _id: "$items.productId",
            name: { $first: "$items.name" },
            quantity: { $sum: "$items.quantity" },
            revenue: { $sum: "$items.total" }
        }},
        { $sort: { quantity: -1 } },
        { $limit: 5 },
        { $project: { productId: '$_id', _id: 0, name: 1, quantity: 1, revenue: 1 } }
      ]).toArray(),

      // Daily revenue for the last 30 days
      db.collection<Order>("orders").aggregate([
        { $match: { tenantId, status: "completed", createdAt: { $gte: thirtyDaysAgo } } },
        { $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$total" }
        }},
        { $sort: { _id: 1 } },
        { $project: { date: '$_id', revenue: 1, _id: 0 } }
      ]).toArray(),
    ]);

    // --- Format data for the frontend ---
    const analytics = {
      totalRevenue: totalRevenueData[0]?.total || 0,
      recentRevenue: recentRevenueData[0]?.total || 0,
      totalOrders: orderStats[0]?.totalOrders || 0,
      pendingOrders: orderStats[0]?.pendingOrders || 0,
      totalProducts: productStats[0]?.totalProducts || 0,
      activeProducts: productStats[0]?.activeProducts || 0,
      averageRating: reviewStats[0]?.avg || 0,
      totalReviews: reviewStats[0]?.count || 0,
      topProducts: topProductsData,
      dailyRevenue: dailyRevenueData,
    };

    return NextResponse.json({ analytics });

  } catch (error) {
    console.error("Tenant analytics error:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
