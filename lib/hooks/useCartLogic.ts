"use client";

import { useState, useCallback, useEffect } from "react";
import type { Tenant } from "@/lib/schemas";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  brand?: string;
  inventory?: number;
  variantId?: string;
}

/**
 * Business Logic: Cart Management
 * Handles all cart operations - add, remove, update quantity
 * Decoupled from UI components
 */
export function useCartLogic(tenantId: string) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem(`cart_${tenantId}`);
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
        setError("Failed to load cart");
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [tenantId]);

  // Save cart to localStorage
  const saveCartToStorage = useCallback((items: CartItem[]) => {
    localStorage.setItem(`cart_${tenantId}`, JSON.stringify(items));
  }, [tenantId]);

  // Update quantity
  const updateQuantity = useCallback((id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }

    const item = cartItems.find((item) => item.id === id);
    if (item?.inventory && newQuantity > item.inventory) {
      toast.error(`Only ${item.inventory} items available in stock`);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
    saveCartToStorage(updatedItems);
  }, [cartItems, saveCartToStorage]);

  // Remove item
  const removeItem = useCallback((id: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    saveCartToStorage(updatedItems);
  }, [cartItems, saveCartToStorage]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(`cart_${tenantId}`);
  }, [tenantId]);

  // Add item
  const addItem = useCallback((item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = prevItems.map((i) =>
          i.id === existingItem.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        updatedItems = [...prevItems, item];
      }

      saveCartToStorage(updatedItems);
      return updatedItems;
    });
  }, [saveCartToStorage]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const getTaxAmount = (taxRate: number) => {
    return subtotal * (taxRate / 100);
  };

  const getShippingCost = (freeShippingThreshold: number = 50) => {
    return subtotal > freeShippingThreshold ? 0 : 9.99;
  };

  return {
    cartItems,
    subtotal,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTaxAmount,
    getShippingCost,
  };
}
