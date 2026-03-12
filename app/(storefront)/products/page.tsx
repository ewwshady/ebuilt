"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, Search, Filter, Loader2, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Shop</h1>
          <p className="text-slate-600">Discover our carefully curated collection of premium products</p>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-11 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setFilterOpen(!filterOpen)}
              className="border-slate-200 gap-2"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 h-11 border border-slate-200 rounded-md bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${filterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg border border-slate-200 p-6 h-fit sticky top-20 space-y-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Filter size={18} />
                Filters
              </h3>

              <div className="pb-6 border-b border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3 text-sm">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
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
        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg mb-4">No products found matching your criteria</p>
            <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} variant="outline">
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card key={product._id} className="group overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={product.image || "https://via.placeholder.com/400x400?text=No+Image"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          -{discount(product.originalPrice, product.price)}%
                        </div>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute top-3 left-3 p-2 bg-white rounded-full shadow hover:bg-slate-100 transition opacity-0 group-hover:opacity-100">
                      <Heart size={18} className="text-slate-600" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">
                        {product.category || "Uncategorized"}
                      </p>
                      <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition">
                        {product.name}
                      </h3>
                    </div>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={
                                i < Math.floor(product.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-600">({product.reviews || 0})</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xl font-bold text-slate-900">Rs. {product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-slate-500 line-through">Rs. {product.originalPrice}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/products/${product._id}`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10 gap-2">
                          <ShoppingCart size={16} />
                          <span>Add to Cart</span>
                        </Button>
                      </Link>
                    </div>
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
