// This file is now a pure Server Component again.
import { notFound } from "next/navigation";
import { getTenantFromSubdomain, serializeTenant } from "@/lib/tenant-server";
import { CartClientPage } from "./CartClientPage"; // Import our new client component

export default async function CartPage() {
    // 1. Do the server-side data fetching. This is what Server Components are great at.
    const tenantRaw = await getTenantFromSubdomain();
    if (!tenantRaw) {
        notFound();
    }
    const tenant = serializeTenant(tenantRaw);

    // 2. Render the CLIENT component and pass the server-fetched data as a prop.
    return <CartClientPage tenant={tenant} />;
}
