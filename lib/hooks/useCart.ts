'use client';

import { useState, useCallback, useEffect } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'ecommerce_cart';

export function useCart() {
  const [cart, setCart] = useState<CartState>({
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    itemCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCart(parsed);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  const calculateTotals = useCallback((items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, tax, total, itemCount };
  }, []);

  const addItem = useCallback((product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart((prev) => {
      const existingItem = prev.items.find((item) => item.productId === product.productId);

      let updatedItems: CartItem[];
      if (existingItem) {
        updatedItems = prev.items.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...prev.items, { ...product, quantity }];
      }

      const totals = calculateTotals(updatedItems);
      return { items: updatedItems, ...totals };
    });
  }, [calculateTotals]);

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => {
      const updatedItems = prev.items.filter((item) => item.productId !== productId);
      const totals = calculateTotals(updatedItems);
      return { items: updatedItems, ...totals };
    });
  }, [calculateTotals]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      let updatedItems: CartItem[];
      if (quantity <= 0) {
        updatedItems = prev.items.filter((item) => item.productId !== productId);
      } else {
        updatedItems = prev.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
      }

      const totals = calculateTotals(updatedItems);
      return { items: updatedItems, ...totals };
    });
  }, [calculateTotals]);

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      itemCount: 0,
    });
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  return {
    cart,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
