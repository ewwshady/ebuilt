"use client";

import { X, Trash2, ShoppingCart, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/lib/schemas";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (itemId: string) => void;
  total: number;
}

export function CartSidebar({ isOpen, onClose, items, onRemove, total }: CartSidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-slate-200 transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="rounded-full bg-slate-100 p-3">
                  <ShoppingCart className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-center font-medium text-gray-600">
                  Your cart is empty
                </p>
                <p className="text-center text-sm text-gray-500">
                  Add some great electronics to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
                  >
                    {/* Product Thumbnail */}
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-lg bg-white overflow-hidden border border-slate-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Zap className="h-8 w-8 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="mt-1 text-sm text-blue-600 font-medium">
                        Rs. {item.price.toLocaleString()}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Qty:</span>
                        <span className="font-semibold text-gray-900">{item.quantity}</span>
                      </div>
                      <p className="mt-1 font-bold text-gray-900">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemove(item._id.toString())}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">
              {/* Subtotal */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-3xl font-bold text-blue-600">
                  Rs. {total.toLocaleString()}
                </span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 active:scale-95"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-gray-900 transition-colors hover:bg-slate-100"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
