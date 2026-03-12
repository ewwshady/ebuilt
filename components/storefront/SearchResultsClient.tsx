"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  price: number
  image: string
  category: string
}

export function SearchResultsClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState("newest")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const limit = 20

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          q: query,
          page: page.toString(),
          limit: limit.toString(),
          sort: sortBy,
        })

        if (minPrice) params.append("minPrice", minPrice)
        if (maxPrice) params.append("maxPrice", maxPrice)

        const res = await fetch(`/api/storefront/search?${params}`)
        const data = await res.json()

        setProducts(data.products || [])
        setTotal(data.total || 0)
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setLoading(false)
      }
    }

    if (query.trim()) {
      fetchResults()
    }
  }, [query, page, sortBy, minPrice, maxPrice])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  const hasMore = page * limit < total

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>

        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <p className="text-sm text-gray-600">
          {total > 0 ? `Found ${total} result${total !== 1 ? "s" : ""}` : "No results found"}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">
              No products found for "{query}". Try different search terms.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                    <p className="text-lg font-bold">Rs. {product.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6">
            <p className="text-sm text-gray-600">
              Showing {Math.min(page * limit, total)} of {total} results
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
