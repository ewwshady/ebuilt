"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

interface WishlistContextType {
  wishlistIds: string[]
  toggleWishlist: (productId: string) => Promise<void>
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/wishlist")
      .then(res => res.json())
      .then(data => {
        if (data.items) setWishlistIds(data.items.map((p: any) => p._id))
      })
      .finally(() => setIsLoading(false))
  }, [])

  const toggleWishlist = async (productId: string) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId })
      })
      
      if (res.status === 401) {
        toast.error("Please login to use wishlist")
        return
      }

      const data = await res.json()
      if (data.added) {
        setWishlistIds(prev => [...prev, productId])
        toast.success("Added to wishlist")
      } else {
        setWishlistIds(prev => prev.filter(id => id !== productId))
        toast.info("Removed from wishlist")
      }
    } catch (err) {
      toast.error("Action failed")
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlist must be used within WishlistProvider")
  return context
}
