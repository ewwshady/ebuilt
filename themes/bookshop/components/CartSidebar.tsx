"use client";

import { X, Trash2, ShoppingCart } from "lucide-react";
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
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-md transform bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-amber-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-amber-900">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-amber-50"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="text-4xl">📚</div>
                <p className="text-center text-gray-600">
                  Your cart is empty. Start adding books!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 rounded-lg border border-amber-100 p-3"
                  >
                    {/* Book Thumbnail */}
                    <div className="relative h-16 w-12 flex-shrink-0 rounded bg-amber-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xl">
                          📖
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="flex-1">
                      <h4 className="font-serif font-semibold text-gray-900 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Rs. {item.price} × {item.quantity}
                      </p>
                      <p className="font-semibold text-amber-600">
                        Rs. {item.price * item.quantity}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemove(item._id.toString())}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
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
            <div className="border-t border-amber-100 p-6 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-amber-600">
                  Rs. {total}
                </span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full rounded-lg bg-amber-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-amber-700"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className="w-full rounded-lg border border-amber-200 bg-white px-4 py-3 font-semibold text-amber-600 transition-colors hover:bg-amber-50"
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
