// app/storefront/checkout/CheckoutClientPage.tsx
"use client";

import type { Tenant } from "@/lib/schemas";
import { themeRegistry } from "@/themes";

// This is a simple client component that just receives props.
export function CheckoutClientPage({ tenant }: { tenant: Tenant }) {

  // Get the correct Checkout component from your theme registry
  const tenantThemeKey = tenant.themeKey || "beauty-test";
  const CheckoutComponent = themeRegistry[tenantThemeKey].components.Checkout;

  // Render the theme's checkout component and pass the full tenant object to it.
  // Your Checkout.tsx correctly expects a `tenant` prop.
  return <CheckoutComponent tenant={tenant} />;
}
