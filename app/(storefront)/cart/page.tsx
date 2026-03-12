"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>>([])

  const [promoCode, setPromoCode] = useState("")

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== id))
    } else {
      setCartItems(cartItems.map(item => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 1000 ? 0 : 100
  const tax = Math.round(subtotal * 0.13)
  const total = subtotal + shipping + tax

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{cartItems.length} items in cart</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-slate-600 mt-1">Rs. {item.price}</p>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        Rs. {item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-2 p-2 hover:bg-red-50 rounded text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="mt-6">
              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="text-slate-900">Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Shipping</span>
                    <span className="text-slate-900">
                      {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax (13%)</span>
                    <span className="text-slate-900">Rs. {tax}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-slate-900">Rs. {total}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      className="text-sm"
                    />
                    <Button variant="outline" className="px-4">
                      Apply
                    </Button>
                  </div>
                  {subtotal > 1000 && (
                    <p className="text-xs text-green-600">
                      ✓ Free shipping on orders over Rs. 1000
                    </p>
                  )}
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11">
                    Proceed to Checkout
                  </Button>
                </Link>

                <p className="text-xs text-slate-500 text-center">
                  Secure checkout powered by eBuild
                </p>
              </CardContent>
            </Card>

            <div className="mt-6 space-y-3">
              <div className="flex gap-3 text-sm">
                <span className="text-lg">🚚</span>
                <div>
                  <p className="font-semibold text-slate-900">Fast Delivery</p>
                  <p className="text-slate-600">Next day delivery available</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-lg">🔒</span>
                <div>
                  <p className="font-semibold text-slate-900">Secure Payment</p>
                  <p className="text-slate-600">All transactions encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-600 mb-6">Add some products to get started</p>
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
