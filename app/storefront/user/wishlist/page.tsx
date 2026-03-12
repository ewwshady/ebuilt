"use client"

import { useEffect, useState } from "react"
import { useWishlist } from "@/lib/use-wishlist"
import Link from "next/link"
import { Trash2, ShoppingBag, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/use-cart"

export default function WishlistPage() {
  const { toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchList = () => {
    fetch("/api/wishlist")
      .then(res => res.json())
      .then(data => {
        setProducts(data.items || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleRemove = async (id: string) => {
    await toggleWishlist(id)
    setProducts(prev => prev.filter(p => p._id !== id))
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-400">Loading your favorites...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-500">Items you've saved for later.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <Heart className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">Your wishlist is empty.</p>
          <Link href="/products"><Button className="mt-4 bg-gray-900 text-white rounded-full">Explore Shop</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img src={product.image} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                <button 
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-red-500 hover:bg-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                <p className="text-pink-600 font-bold">${product.price.toFixed(2)}</p>
                <div className="pt-2">
                  <Button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-gray-900 text-white rounded-full h-10 text-sm"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
