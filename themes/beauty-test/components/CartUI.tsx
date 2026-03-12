"use client";

import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Tag, Shield, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Tenant } from "@/lib/schemas";
import type { CartItem } from "@/lib/hooks/useCartLogic";

/**
 * UI ONLY: Cart Display Component
 * Receives all data and handlers as props
 * No business logic here
 */
interface CartUIProps {
  tenant: Tenant;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  isLoading: boolean;
  error: string | null;
  promoCode: string;
  appliedCode: string | null;
  isSubmitting?: boolean;

  // Handlers
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onPromoCodeChange: (code: string) => void;
  onApplyPromo: () => void;
  onCheckout: () => void;
}

export function CartUI({
  tenant,
  cartItems,
  subtotal,
  tax,
  shipping,
  discount,
  total,
  isLoading,
  error,
  promoCode,
  appliedCode,
  isSubmitting = false,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPromoCodeChange,
  onApplyPromo,
  onCheckout,
}: CartUIProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: tenant.theme.primaryColor }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-serif text-gray-900">Your Shopping Cart</h1>
          <p className="mt-2 text-gray-600">Review your items and proceed to checkout</p>
        </div>

        {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

        {cartItems.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
            <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-pink-100">
              <ShoppingBag className="h-12 w-12" style={{ color: tenant.theme.primaryColor }} />
            </div>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">Your cart is empty</h2>
            <p className="mb-8 text-gray-600">Add some beautiful products to your cart</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white"
              style={{ backgroundColor: tenant.theme.primaryColor }}
            >
              <ShoppingCart className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl bg-white shadow-lg overflow-hidden">
                <div className="px-6 py-4 font-semibold text-white" style={{ backgroundColor: tenant.theme.primaryColor }}>
                  <div className="flex items-center justify-between">
                    <span>{cartItems.length} Item{cartItems.length !== 1 ? "s" : ""} in Cart</span>
                    <span className="text-sm font-normal">
                      Total: {tenant.settings.currency}
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${item.variantId || "default"}-${index}`} className="p-6">
                      <div className="flex flex-col gap-6 md:flex-row">
                        <div className="flex-shrink-0">
                          <div className="h-32 w-32 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-white">
                            <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="mb-2 flex items-center gap-2">
                                {item.brand && (
                                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                    {item.brand}
                                  </span>
                                )}
                                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">
                                  {item.category}
                                </span>
                              </div>
                              <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-xl font-bold" style={{ color: tenant.theme.primaryColor }}>
                                {tenant.settings.currency} {item.price.toFixed(2)}
                              </p>
                              {item.inventory && <p className="text-sm text-gray-500 mt-1">{item.inventory} in stock</p>}
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center rounded-full border border-gray-300">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="text-sm text-gray-600">
                                <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                                  Remove
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                {tenant.settings.currency} {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6 rounded-3xl bg-white p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Have a promo code?</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => onPromoCodeChange(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2"
                    style={{ focusRingColor: tenant.theme.primaryColor }}
                  />
                  <button onClick={onApplyPromo} className="rounded-full bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800 transition-colors">
                    Apply
                  </button>
                </div>
                {appliedCode && <div className="mt-3 text-sm text-green-600">✓ Promo code applied!</div>}
              </div>

              {/* Continue Shopping & Clear Cart */}
              <div className="mt-6 flex items-center gap-4">
                <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
                <span className="text-gray-400">|</span>
                <button onClick={onClearCart} className="text-red-500 hover:text-red-700">
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-8 rounded-3xl bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {tenant.settings.currency} {subtotal.toFixed(2)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span className="font-medium text-green-600">
                        -{tenant.settings.currency} {discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium text-gray-900">
                      {tenant.settings.currency} {tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">
                      {shipping === 0 ? "FREE" : `${tenant.settings.currency} ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="mb-6 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{tenant.settings.currency} {total.toFixed(2)}</span>
                </div>

                <button
                  onClick={onCheckout}
                  disabled={isSubmitting}
                  className="block w-full text-center rounded-full px-8 py-4 font-semibold text-white transition-colors mb-4"
                  style={{ backgroundColor: tenant.theme.primaryColor }}
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin inline" /> : "Proceed to Checkout"}
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
