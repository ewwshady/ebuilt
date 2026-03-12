'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { CartItem } from '@/lib/hooks/useCart';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onRemoveItem?: (productId: string) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onCheckout?: () => void;
}

export function CartSidebar({
  isOpen,
  onClose,
  items,
  subtotal,
  tax,
  total,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}: CartSidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-xs transform bg-white transition-transform duration-300 ease-in-out md:relative md:max-w-sm ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-gray-600">Your cart is empty</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="space-y-4 p-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 border-b pb-4">
                    {/* Product Image */}
                    {item.image && (
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </p>

                      {/* Quantity Controls */}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity?.(item.productId, item.quantity - 1)
                          }
                          className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() =>
                            onUpdateQuantity?.(item.productId, item.quantity + 1)
                          }
                          className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem?.(item.productId)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t bg-gray-50 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-base font-bold">
                  <span>Total:</span>
                  <span className="text-pink-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                onClick={onCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
