"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react"

export default function ProductsPage() {
  const [products] = useState([
    {
      id: 1,
      name: "Premium Lipstick",
      sku: "LIP-001",
      price: 599,
      stock: 45,
      status: "active",
    },
    {
      id: 2,
      name: "Face Moisturizer",
      sku: "FM-002",
      price: 1299,
      stock: 23,
      status: "active",
    },
    {
      id: 3,
      name: "Hair Serum",
      sku: "HS-003",
      price: 899,
      stock: 0,
      status: "out_of_stock",
    },
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-slate-400 mt-1">Manage your store's products</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <Input
            placeholder="Search products..."
            className="pl-10 bg-slate-900 border-slate-800 text-white"
          />
        </div>
      </div>

      {/* Products Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">All Products</CardTitle>
          <CardDescription>{products.length} products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700">
                <tr className="text-slate-400">
                  <th className="text-left py-3 px-4">Product Name</th>
                  <th className="text-left py-3 px-4">SKU</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                    <td className="py-4 px-4 font-medium text-white">{product.name}</td>
                    <td className="py-4 px-4 text-slate-300">{product.sku}</td>
                    <td className="py-4 px-4 text-white font-semibold">Rs. {product.price}</td>
                    <td className="py-4 px-4">
                      <span className={product.stock > 0 ? "text-green-400" : "text-red-400"}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {product.status === "active" ? "Active" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
