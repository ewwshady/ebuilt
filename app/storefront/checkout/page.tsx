// app/storefront/checkout/page.tsx

// This is now a clean Server Component. No more "use client".
import { notFound } from "next/navigation";
import { getTenantFromSubdomain, serializeTenant } from "@/lib/tenant-server";
import { CheckoutClientPage } from "./CheckoutClientPage"; // Import our new client wrapper

export default async function CheckoutPage() {
  // 1. Fetch data ON THE SERVER. This is fast, secure, and always works.
  console.log("Fetching tenant on the server for checkout...");
  const tenantRaw = await getTenantFromSubdomain();
  if (!tenantRaw) {
    notFound();
  }
  const tenant = serializeTenant(tenantRaw);
  console.log(`Tenant "${tenant.name}" found. Rendering checkout page.`);

  // 2. Render the CLIENT component and pass the server-fetched data as a prop.
  return <CheckoutClientPage tenant={tenant} />;
}
