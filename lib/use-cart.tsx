"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useRef } from "react";

// --- Interfaces (No changes needed here) ---
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartReady: boolean;
}

// --- Context (No changes needed here) ---
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- MODIFIED PROVIDER COMPONENT ---
// It now accepts a `tenantId` to create dynamic, tenant-specific storage keys.
export function CartProvider({
  children,
  tenantId,
}: {
  children: React.ReactNode;
  tenantId: string;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartReady, setIsCartReady] = useState(false);
  const isInitialMount = useRef(true);

  // This creates a unique storage key for each tenant, e.g., "cart_60d5f..."
  const cartKey = `cart_${tenantId}`;

  // Effect to LOAD initial state from the tenant-specific localStorage key.
  // This now depends on `tenantId` to run correctly.
  useEffect(() => {
    // If we don't have a tenantId yet, we can't load the cart.
    if (!tenantId) {
      setIsCartReady(true); // Still need to signal readiness to avoid infinite loaders
      return;
    }

    console.log(`Attempting to load cart from localStorage key: ${cartKey}`);

    try {
      const savedCart = window.localStorage.getItem(cartKey);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        console.log("Successfully loaded cart:", parsedCart);
      } else {
        console.log("No saved cart found in localStorage for this tenant.");
      }
    } catch (e) {
      console.error("Failed to read or parse cart from localStorage", e);
    } finally {
      // Signal that the cart is ready to be displayed, whether it was loaded or is empty.
      setIsCartReady(true);
    }
    // This effect runs when the component mounts and if the tenantId ever changes.
  }, [tenantId]);

  // Effect to SAVE state to the tenant-specific localStorage key whenever `items` changes.
  useEffect(() => {
    // If this is the initial render, do not save. This prevents the initial
    // empty `items` array from overwriting a cart that was already in storage.
    if (!isCartReady || isInitialMount.current) {
        if(isCartReady) {
          isInitialMount.current = false;
        }
        return;
    }
    
    // If we don't have a tenantId, we can't save the cart.
    if (!tenantId) return;

    console.log(`Saving ${items.length} items to localStorage key: ${cartKey}`);
    localStorage.setItem(cartKey, JSON.stringify(items));
    
  }, [items, tenantId, isCartReady]); // This effect now depends on `items`, `tenantId`, and `isCartReady`

  // --- Cart Actions (No changes needed here) ---

  const addItem = (itemToAdd: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === itemToAdd.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === itemToAdd.productId
            ? { ...i, quantity: i.quantity + itemToAdd.quantity }
            : i
        );
      }
      return [...prev, itemToAdd];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  // --- Calculated Totals (No changes needed here) ---
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartReady,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// --- Custom Hook (No changes needed here) ---
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
