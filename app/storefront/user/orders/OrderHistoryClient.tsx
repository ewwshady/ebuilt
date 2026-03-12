// app/storefront/user/orders/OrderHistoryClient.tsx

"use client"

import Link from "next/link"
import { DataTable } from "@/components/admin/DataTable"
import { Button } from "@/components/ui/button"
import { Eye, Package } from "lucide-react"

// Define a type for your order and tenant for better type safety
type Order = {
  _id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: string;
  paymentStatus: string;
  // Add other order properties here
};

type Tenant = {
  settings?: {
    currency?: string;
  };
  // Add other tenant properties here
};

type OrderHistoryClientProps = {
  orders: Order[];
  tenant: Tenant;
};

export function OrderHistoryClient({ orders, tenant }: OrderHistoryClientProps) {
  // ❗️Columns are now defined in the Client Component
  const columns = [
    {
      key: "orderNumber",
      label: "Order Number",
      render: (val: string) => <span className="font-semibold text-gray-900">{val}</span>
    },
    {
      key: "createdAt",
      label: "Placed on",
      render: (val: string) => val ? new Date(val).toLocaleDateString() : "N/A"
    },
    {
      key: "total",
      label: "Total Amount",
      render: (val: number) => (
        <span className="font-medium">
          {tenant.settings?.currency || "$"} {val.toFixed(2)}
        </span>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (val: string) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          val === 'completed' ? 'bg-green-100 text-green-800' :
          val === 'processing' ? 'bg-blue-100 text-blue-800' :
          val === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </span>
      )
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (val: string) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          val === 'paid' ? 'bg-green-50 text-green-700 border border-green-200' :
          val === 'failed' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-gray-50 text-gray-700 border border-gray-200'
        }`}>
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-1">View and track all your previous purchases.</p>
        </div>
        <Link href="/products">
          <Button variant="outline" className="rounded-full">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {/* Orders Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {orders.length > 0 ? (
          <DataTable
            columns={columns}
            data={orders}
            emptyMessage="You haven't placed any orders yet."
            actions={(row: any) => (
              <Link href={`/user/orders/${row._id}`}>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            )}
          />
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">No orders found</h2>
            <p className="text-gray-500 mt-2">Your order history is currently empty.</p>
            <Link href="/products" className="inline-block mt-6">
              <Button className="bg-gray-900 text-white rounded-full px-8 h-11">
                Explore Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
