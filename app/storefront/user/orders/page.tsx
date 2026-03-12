// app/storefront/user/orders/page.tsx

import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { getTenantFromSubdomain } from "@/lib/tenant-server";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import { OrderHistoryClient } from "./OrderHistoryClient"; // 👈 Import the new client component

// Helper function to recursively serialize MongoDB documents
function serializeMongoObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof ObjectId) return obj.toString();
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(serializeMongoObject);
  if (typeof obj === 'object') {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = serializeMongoObject(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

async function getOrders(userId: string, tenantId: string) {
  try {
    const db = await getDb();
    const orders = await db.collection("orders")
      .find({
        customerId: new ObjectId(userId),
        tenantId: new ObjectId(tenantId)
      })
      .sort({ createdAt: -1 })
      .toArray();
    return orders.map(order => serializeMongoObject(order));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

// This remains a Server Component!
export default async function UserOrdersPage() {
  const session = await getSession();
  const tenant = await getTenantFromSubdomain();

  if (!session) return null;
  if (!tenant) notFound();

  const orders = await getOrders(session.userId, session.tenantId);
  const serializableTenant = serializeMongoObject(tenant);

  // ❗️ Render the client component and pass serializable props
  return <OrderHistoryClient orders={orders} tenant={serializableTenant} />;
}
