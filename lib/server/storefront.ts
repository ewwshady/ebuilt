import type { ObjectId } from 'mongodb';
import type { Product, Tenant, User } from '@/lib/schemas';

// Mock data - replace with actual database calls
const mockDb = {
  users: [] as User[],
  products: [] as Product[],
  tenants: [] as Tenant[],
};

// Serialization helpers
function serializeDate(date: any) {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export function serializeProduct(product: any) {
  return {
    ...product,
    _id: product._id?.toString?.() || product._id,
    tenantId: product.tenantId?.toString?.() || product.tenantId,
    createdAt: serializeDate(product.createdAt),
    updatedAt: serializeDate(product.updatedAt),
    collections: product.collections?.map((c: any) => c.toString?.() || c) || [],
  };
}

// Server-side data fetching functions
export async function getOwner(tenantId: ObjectId | string) {
  try {
    // Replace with actual database call
    const owner = mockDb.users.find(
      (u) => u.tenantId.toString() === tenantId.toString() && u.role === 'admin'
    );

    if (!owner) return null;

    return {
      ...owner,
      _id: owner._id.toString(),
      tenantId: owner.tenantId.toString(),
      createdAt: serializeDate(owner.createdAt),
    };
  } catch (error) {
    console.error('Get owner error:', error);
    return null;
  }
}

export async function getProducts(tenantId: ObjectId | string) {
  try {
    // Replace with actual database call
    const products = mockDb.products
      .filter((p) => p.tenantId.toString() === tenantId.toString() && p.status === 'active')
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 12);

    return products.map(serializeProduct);
  } catch (error) {
    console.error('Get products error:', error);
    return [];
  }
}

export async function getProductCategories(tenantId: ObjectId | string): Promise<string[]> {
  try {
    // Replace with actual database call
    const categories = [
      ...new Set(
        mockDb.products
          .filter((p) => p.tenantId.toString() === tenantId.toString() && p.status === 'active')
          .map((p) => p.category)
          .filter(Boolean)
      ),
    ] as string[];

    return categories;
  } catch (error) {
    console.error('Get categories error:', error);
    return [];
  }
}

export async function getProductsByCategory(
  tenantId: ObjectId | string,
  category: string
) {
  try {
    const products = mockDb.products.filter(
      (p) =>
        p.tenantId.toString() === tenantId.toString() &&
        p.status === 'active' &&
        p.category === category
    );

    return products.map(serializeProduct);
  } catch (error) {
    console.error('Get products by category error:', error);
    return [];
  }
}

export async function getProductById(productId: string) {
  try {
    const product = mockDb.products.find((p) => p._id.toString() === productId);
    if (!product) return null;
    return serializeProduct(product);
  } catch (error) {
    console.error('Get product error:', error);
    return null;
  }
}

export async function getTenant(tenantId: ObjectId | string) {
  try {
    const tenant = mockDb.tenants.find((t) => t._id.toString() === tenantId.toString());
    if (!tenant) return null;

    return {
      ...tenant,
      _id: tenant._id.toString(),
      createdAt: serializeDate(tenant.createdAt),
      updatedAt: serializeDate(tenant.updatedAt),
    };
  } catch (error) {
    console.error('Get tenant error:', error);
    return null;
  }
}
