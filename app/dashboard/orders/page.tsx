"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/use-auth"
import { useRouter } from "next/navigation"
import { OrderTable } from "@/components/order-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Order } from "@/lib/schemas"

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!loading && (!user || user.role !== "tenant_admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.tenantId) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/orders?tenantId=${user?.tenantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error("Fetch orders error:", error)
    }
  }

  const filterOrders = (status: string) => {
    if (status === "all") return orders
    return orders.filter((order) => order.status === status)
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const stats = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage customer orders and fulfillment</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({stats.processing})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <OrderTable orders={orders} onUpdate={fetchOrders} />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <OrderTable orders={filterOrders("pending")} onUpdate={fetchOrders} />
        </TabsContent>
        <TabsContent value="processing" className="mt-6">
          <OrderTable orders={filterOrders("processing")} onUpdate={fetchOrders} />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <OrderTable orders={filterOrders("completed")} onUpdate={fetchOrders} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
