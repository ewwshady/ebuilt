"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"
import { AnalyticsChart } from "@/components/analytics-chart" // Make sure this component exists
import { Package, ShoppingCart, DollarSign, Star, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Define a type for the data from our new API
type TenantAnalytics = {
  totalRevenue: number;
  recentRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  activeProducts: number;
  averageRating: number;
  totalReviews: number;
  topProducts: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  dailyRevenue: {
    date: string;
    revenue: number;
  }[];
};

export default function DashboardOverview() {
  const { user } = useAuth()
  const router = useRouter()
  // Use our new type for state
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)

  // Auth check is now primarily handled in the layout, but we still need the user object
  // so we can keep this useEffect for fetching data
  useEffect(() => {
    if (user?.role === "tenant_admin" && user.tenantId) {
      fetchAnalytics()
    }
  }, [user])

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const token = localStorage.getItem("token")
      // Pointing to the new, correct, powerful endpoint
      const response = await fetch(`/api/tenants/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      } else {
        console.error("Failed to load analytics data.");
        setAnalytics(null);
      }
    } catch (error) {
      console.error("Fetch analytics error:", error)
    } finally {
      setLoadingAnalytics(false)
    }
  }

  // The layout handles the main loading state, this is for the page-specific data
  if (loadingAnalytics) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse text-neutral-400 text-sm tracking-wide">
          Loading dashboard data...
        </div>
      </div>
    )
  }
  
  // Handle case where data failed to load
  if (!analytics) {
      return (
          <div className="rounded-2xl bg-red-900/50 border border-red-500 p-8 text-white shadow-lg">
             <h1 className="text-2xl font-bold">Something went wrong</h1>
             <p className="text-white/80 mt-2">We couldn't load your store's analytics. Please try refreshing the page.</p>
          </div>
      )
  }

  const stats = [
    { title: "Total Products", value: analytics.totalProducts, sub: `${analytics.activeProducts} active`, icon: Package, color: "bg-blue-500/10 text-blue-400" },
    { title: "Total Orders", value: analytics.totalOrders, sub: `${analytics.pendingOrders} pending`, icon: ShoppingCart, color: "bg-purple-500/10 text-purple-400" },
    { title: "Revenue", value: `Rs.${analytics.totalRevenue.toFixed(2)}`, sub: `Rs.${analytics.recentRevenue.toFixed(2)} last 7 days`, icon: DollarSign, color: "bg-emerald-500/10 text-emerald-400" },
    { title: "Avg Rating", value: analytics.averageRating.toFixed(1), sub: `${analytics.totalReviews} reviews`, icon: Star, color: "bg-amber-500/10 text-amber-400" },
  ]

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-white/80 mt-2">Here’s what’s happening in your store today.</p>
      </div>

      {/* Stats Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-neutral-800 bg-[#1A1A1A] text-white shadow-md hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-xs text-neutral-500 mt-1">{stat.sub}</p>
              </div>
              <div className={`h-12 w-12 flex items-center justify-center rounded-xl ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      {analytics.dailyRevenue && (
        <div className="rounded-2xl border border-neutral-800 bg-[#1A1A1A] p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-white">Revenue Overview (Last 30 Days)</h2>
          {/* Ensure your AnalyticsChart component is compatible with the dark theme */}
          <AnalyticsChart data={analytics.dailyRevenue} />
        </div>
      )}

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-neutral-800 bg-[#1A1A1A] text-white shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-6">Top Performing Products</h2>
            {analytics.topProducts?.length ? (
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={product.productId} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-semibold text-neutral-400">{index + 1}</div>
                      <div>
                        <p className="font-medium group-hover:text-amber-400 transition">{product.name}</p>
                        <p className="text-xs text-neutral-500">{product.quantity} sold</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm text-emerald-400">${product.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (<p className="text-sm text-neutral-500">No sales data available yet.</p>)}
          </CardContent>
        </Card>
        <Card className="border-neutral-800 bg-[#1A1A1A] text-white shadow-md">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            {[
              { label: "Add New Product", desc: "Expand your catalog", link: "/dashboard/products" },
              { label: "View Orders", desc: "Manage customer orders", link: "/dashboard/orders" },
              { label: "Store Settings", desc: "Configure your store", link: "/dashboard/settings" },
            ].map((action) => (
              <button key={action.label} onClick={() => router.push(action.link)} className="w-full flex items-center justify-between rounded-xl border border-neutral-800 px-5 py-4 hover:bg-neutral-800/50 transition">
                <div className="text-left">
                  <p className="font-medium">{action.label}</p>
                  <p className="text-xs text-neutral-500">{action.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-600" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
