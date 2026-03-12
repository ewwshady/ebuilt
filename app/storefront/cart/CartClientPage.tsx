"use client"; // <-- This is the most important line. It makes this a Client Component.

import dynamic from 'next/dynamic';
import type { Tenant } from "@/lib/schemas";
import { themeRegistry } from "@/themes";

// The same loading component you already have
const LoadingComponent = () => (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
    </div>
);

interface CartClientPageProps {
  tenant: Tenant;
}

export function CartClientPage({ tenant }: CartClientPageProps) {
  // Now we are in a Client Component, so this is allowed.
  const CartComponent = dynamic(
    () => Promise.resolve(themeRegistry[tenant.themeKey || "beauty-test"].components.Cart),
    { 
      ssr: false, // No more error!
      loading: () => <LoadingComponent /> 
    }
  );

  return <CartComponent tenant={tenant} />;
}
