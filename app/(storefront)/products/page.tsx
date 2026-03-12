"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, Search, SlidersHorizontal, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [loading, setLoading] = useState(true)

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

  const categories = ["all", ...new Set(products.map(p => p.category))]

  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (sortBy === "price-low") filteredProducts.sort((a, b) => a.price - b.price)
  if (sortBy === "price-high") filteredProducts.sort((a, b) => b.price - a.price)
  if (sortBy === "rating") filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))

  const discount = (originalPrice: number, price: number) =>
    Math.round(((originalPrice - price) / originalPrice) * 100)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">All Products</h1>
          <p className="text-slate-600">Browse our complete collection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 h-fit sticky top-20 space-y-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={18} />
                Filters
              </h3>

              <div className="pb-6 border-b">
                <h4 className="font-medium text-slate-900 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-3 text-slate-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-12 h-11 bg-white border-slate-300"
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">
                  Showing <strong>{filteredProducts.length}</strong> products
                </p>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white cursor-pointer pr-10"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <p className="text-slate-600">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product._id} className="hover:shadow-lg transition overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img
                          src={product.image || "https://via.placeholder.com/400x400"}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-110 transition duration-300"
                        />
                        {product.originalPrice > product.price && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            -{discount(product.originalPrice, product.price)}%
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide font-semibold">
                            {product.category || "General"}
                          </p>
                          <h3 className="font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                        </div>

                        {product.rating && (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < Math.floor(product.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-slate-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs text-slate-600">({product.reviews || 0})</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-slate-900">Rs. {product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-slate-500 line-through">Rs. {product.originalPrice}</span>
                          )}
                        </div>

                        <Link href={`/products/${product._id}`} className="block">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10">
                            Add to Cart
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-slate-600 text-lg mb-4">No products found</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
