"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/use-cart"

interface AddToCartButtonProps {
  product: {
    _id: string
    name: string
    slug: string
    price: number
    images: string[]
    inventory: {
      trackInventory: boolean
      quantity: number
    }
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      slug: product.slug,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const isOutOfStock = product.inventory.trackInventory && product.inventory.quantity === 0

  return (
    <Button size="lg" className="flex-1" disabled={isOutOfStock || added} onClick={handleAddToCart}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      {added ? "Added!" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </Button>
  )
}
