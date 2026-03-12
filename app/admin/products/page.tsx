"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit2, Trash2, Eye, Loader2 } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error("Failed to load products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <Loader2 className="inline-block animate-spin text-slate-400" size={24} />
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product._id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-4 px-4">{product.name}</td>
                      <td className="py-4 px-4 text-slate-400">{product.category || "Uncategorized"}</td>
                      <td className="py-4 px-4">Rs. {product.price}</td>
                      <td className="py-4 px-4 text-slate-400">{product.stock || 0}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-4 flex gap-2">
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                          <Eye size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                          <Edit2 size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
