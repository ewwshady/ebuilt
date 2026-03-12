'use client';

import React, { ReactNode } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { useCart } from '@/lib/hooks/useCart';
import { useState } from 'react';

interface ThemeLayoutProps {
  children: ReactNode;
  tenantName?: string;
  onSearch?: (query: string) => void;
  onAddToCart?: (productId: string, quantity: number) => void;
}

export function ThemeLayout({
  children,
  tenantName = 'Store',
  onSearch,
  onAddToCart,
}: ThemeLayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        tenantName={tenantName}
        cartItemCount={cart.itemCount}
        onSearchChange={onSearch}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {children}
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart.items}
        subtotal={cart.subtotal}
        tax={cart.tax}
        total={cart.total}
        onRemoveItem={removeItem}
        onUpdateQuantity={updateQuantity}
      />

      <Footer tenantName={tenantName} />
    </div>
  );
}
