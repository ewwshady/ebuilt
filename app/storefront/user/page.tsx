import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button" // FIX: Added missing import
import { Package, Truck } from "lucide-react"
import Link from "next/link"

async function getCustomerStats(userId: string, tenantId: string) {
  try {
    const db = await getDb()
    
    // Fetch the most recent order
    const orders = await db.collection("orders").find({ 
      customerId: new ObjectId(userId),
      tenantId: new ObjectId(tenantId)
    }).sort({ createdAt: -1 }).limit(1).toArray()

    // Count total orders for the customer
    const totalOrders = await db.collection("orders").countDocuments({ 
      customerId: new ObjectId(userId),
      tenantId: new ObjectId(tenantId)
    })

    return {
      lastOrder: orders[0] ? JSON.parse(JSON.stringify(orders[0])) : null,
      totalOrders
    }
  } catch (error) {
    console.error("Error fetching customer stats:", error)
    return { lastOrder: null, totalOrders: 0 }
  }
}

export default async function UserDashboardPage() {
  const session = await getSession()
  
  if (!session) return null

  const stats = await getCustomerStats(session.userId, session.tenantId)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">Here's a summary of your account activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      {stats.lastOrder ? (
        <Card className="border-blue-100 bg-blue-50/30 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" /> Recent Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{stats.lastOrder.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(stats.lastOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">Rs. {stats.lastOrder.total.toFixed(2)}</p>
                <Link href={`/user/orders/${stats.lastOrder._id}`}>
                  <span className="text-sm text-blue-600 hover:underline cursor-pointer font-medium">
                    View Details
                  </span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="text-gray-500 mt-1">When you buy something, it will show up here.</p>
          <Link href="/products">
            <Button className="mt-6 bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8">
              Start Shopping
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
