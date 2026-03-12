"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, Search, SlidersHorizontal, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  const products = [
    {
      id: 1,
      name: "Premium Lipstick",
      price: 599,
      originalPrice: 799,
      image: "https://images.unsplash.com/photo-1607638924702-92f191c48520?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 124,
      category: "Makeup",
      inStock: true,
      isNew: true,
    },
    {
      id: 2,
      name: "Face Serum",
      price: 1299,
      originalPrice: 1499,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 89,
      category: "Skincare",
      inStock: true,
      isNew: false,
    },
    {
      id: 3,
      name: "Eye Cream",
      price: 899,
      originalPrice: 999,
      image: "https://images.unsplash.com/photo-1512207736139-6c3ee1990d4b?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 156,
      category: "Skincare",
      inStock: true,
      isNew: false,
    },
    {
      id: 4,
      name: "Face Cleanser",
      price: 449,
      originalPrice: 599,
      image: "https://images.unsplash.com/photo-1533579774546-a7f8e6590b75?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 201,
      category: "Skincare",
      inStock: true,
      isNew: false,
    },
    {
      id: 5,
      name: "Hair Mask",
      price: 749,
      originalPrice: 899,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
      rating: 4.5,
      reviews: 78,
      category: "Haircare",
      inStock: true,
      isNew: true,
    },
    {
      id: 6,
      name: "Face Mask",
      price: 599,
      originalPrice: 799,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 234,
      category: "Skincare",
      inStock: false,
      isNew: false,
    },
    {
      id: 7,
      name: "Toner",
      price: 799,
      originalPrice: 999,
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 145,
      category: "Skincare",
      inStock: true,
      isNew: false,
    },
    {
      id: 8,
      name: "Eyeliner",
      price: 349,
      originalPrice: 499,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
      rating: 4.4,
      reviews: 67,
      category: "Makeup",
      inStock: true,
      isNew: false,
    },
  ]

  const categories = [
    { value: "all", label: "All Products" },
    { value: "Makeup", label: "Makeup" },
    { value: "Skincare", label: "Skincare" },
    { value: "Haircare", label: "Haircare" },
  ]

  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort products
  if (sortBy === "price-low") filteredProducts.sort((a, b) => a.price - b.price)
  if (sortBy === "price-high") filteredProducts.sort((a, b) => b.price - a.price)
  if (sortBy === "rating") filteredProducts.sort((a, b) => b.rating - a.rating)
  if (sortBy === "newest") filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))

  const discount = (originalPrice: number, price: number) =>
    Math.round(((originalPrice - price) / originalPrice) * 100)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">All Products</h1>
        <p className="text-slate-600">Explore our complete collection of beauty products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 h-fit sticky top-20 space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={18} />
                Filters
              </h3>
            </div>

            {/* Category Filter */}
            <div className="pb-6 border-b">
              <h4 className="font-medium text-slate-900 mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === category.value
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pb-6 border-b">
              <h4 className="font-medium text-slate-900 mb-3">Price Range</h4>
              <div className="space-y-2 text-sm text-slate-600">
                {[
                  { label: "Under Rs. 500", value: "under" },
                  { label: "Rs. 500 - Rs. 1000", value: "mid" },
                  { label: "Rs. 1000 - Rs. 2000", value: "high" },
                  { label: "Above Rs. 2000", value: "ultra" },
                ].map(range => (
                  <label key={range.value} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                    <input type="checkbox" className="rounded" />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Rating</h4>
              <div className="space-y-2 text-sm">
                {[5, 4, 3].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
                    <input type="checkbox" className="rounded" />
                    <span className="flex items-center gap-1">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-1">& up</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Top Bar - Search & Sort */}
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
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="hover:shadow-lg transition overflow-hidden">
                  <CardContent className="p-0">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition duration-300"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {product.isNew && (
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            New
                          </div>
                        )}
                        {product.originalPrice > product.price && (
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            -{discount(product.originalPrice, product.price)}%
                          </div>
                        )}
                      </div>

                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide font-semibold">
                          {product.category}
                        </p>
                        <h3 className="font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                      </div>

                      {/* Rating */}
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
                        <span className="text-xs text-slate-600">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900">Rs. {product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-slate-500 line-through">Rs. {product.originalPrice}</span>
                        )}
                      </div>

                      {/* Action */}
                      <Link href={`/storefront/products/${product.id}`} className="block">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 h-10"
                          disabled={!product.inStock}
                        >
                          {product.inStock ? "View Details" : "Out of Stock"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-600 text-lg mb-4">No products found matching your criteria</p>
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
  )
}
