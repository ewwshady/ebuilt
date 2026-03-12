import { notFound } from "next/navigation";
import { getDb } from "@/lib/mongodb";
import { getTenantFromSubdomain, serializeTenant } from "@/lib/tenant-server";
import { themeRegistry } from "@/themes";
import type { ObjectId } from "mongodb";
import type { Product } from "@/lib/schemas";

// --- Database fetchers ---

async function getProducts(tenantId: ObjectId): Promise<Product[]> {
  const db = await getDb();
  return db
    .collection<Product>("products")
    .find({
      tenantId,
      status: "active",
    })
    .limit(12)
    .toArray();
}

// --- Normalization Helper ---

function serializeProductsForTheme(products: any[]) {
  return products.map(product => ({
    ...product,
    _id: product._id?.toString(),
    tenantId: product.tenantId?.toString(),
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : null,
    updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : null,
    // Normalize images
    images: (product.images || []).map((img: any) => 
      typeof img === 'string' ? img : img.url
    ).filter(Boolean),
    image: ((product.images || []).map((img: any) => 
      typeof img === 'string' ? img : img.url
    ).filter(Boolean))[0] || "/placeholder.svg?height=300&width=300",
  }));
}

// --- STOREFRONT PAGE ---

export default async function StorefrontPage() {
  // Fetch tenant from subdomain
  const tenantRaw = await getTenantFromSubdomain();
  if (!tenantRaw) notFound();

  // Fetch products
  const productsRaw = await getProducts(tenantRaw._id as ObjectId);

  // Normalize data
  const tenant = serializeTenant(tenantRaw);
  const products = serializeProductsForTheme(productsRaw);

  // Get theme - use tenant's selected theme or fallback
  const themeKey = tenant.themeKey || "beauty-test";
  const theme = themeRegistry[themeKey] || themeRegistry["beauty-test"];
  
  if (!theme) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-xl font-bold">Theme Not Found</h1>
        <p>Theme "{themeKey}" is not registered</p>
      </div>
    );
  }

  const ThemeLayout = theme.components.ThemeLayout;
  const ProductCard = theme.components.ProductCard;

  return (
    <ThemeLayout tenant={tenant} currentPage="home">
      <div className="w-full">
        {/* Hero Section */}
        <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">{tenant.name}</h1>
            <p className="text-xl text-gray-300">
              {tenant.description || "Welcome to our store"}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  tenant={tenant}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products available yet</p>
            </div>
          )}
        </div>
      </div>
    </ThemeLayout>
  );
}
