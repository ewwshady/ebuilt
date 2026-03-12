import { notFound } from "next/navigation"
import { getDb } from "@/lib/mongodb"
import type { ObjectId } from "mongodb"
import type { Product, Category } from "@/lib/schemas"
import { getTenantFromSubdomain, serializeTenant } from "@/lib/tenant-server"
import { themeRegistry } from "@/themes"

async function getProducts(tenantId: ObjectId): Promise<Product[]> {
  try {
    const db = await getDb()
    return await db
      .collection<Product>("products")
      .find({
        tenantId,
        status: "active",
      })
      .sort({ createdAt: -1 })
      .toArray()
  } catch (error) {
    console.error("Get products error:", error)
    return []
  }
}

function serializeProduct(product: any) {
  // --- IMAGE NORMALIZATION ---
  // This ensures the theme gets the URL string it expects
  const normalizedImages = (product.images || []).map((img: any) => {
    // If it's already a string (old data), keep it. 
    // If it's an object (new schema), get the .url property.
    return typeof img === 'string' ? img : img.url;
  }).filter(Boolean);

  return {
    ...product,
    _id: product._id?.toString(),
    tenantId: product.tenantId?.toString(),
    collections: product.collections?.map((c: any) => c.toString()) || [],
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : null,
    updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : null,
    
    // Provide both formats to be safe
    images: normalizedImages, 
    // Most themes look for 'image' (singular) for the main thumbnail
    image: normalizedImages[0] || "", 
    
    // Keep the raw objects in a separate field if the theme wants alt text
    rawImages: product.images || []
  }
}

export default async function ProductsPage() {
  const tenantRaw = await getTenantFromSubdomain()
  if (!tenantRaw) notFound()

  const tenant = serializeTenant(tenantRaw)
  const productsRaw = await getProducts(tenantRaw._id as ObjectId)
  
  // Apply the new serialization with image normalization
  const products = productsRaw.map(serializeProduct)

  const categories: Category[] = [
    { name: "All", count: products.length },
    ...Array.from(
      products.reduce((map, product) => {
        if (!product.category) return map
        map.set(product.category, (map.get(product.category) || 0) + 1)
        return map
      }, new Map<string, number>())
    ).map(([name, count]) => ({ name, count })),
  ]

  const tenantThemeKey = tenant.themeKey || "beauty-test"
  const theme = themeRegistry[tenantThemeKey] || themeRegistry["beauty-test"]

  // Support for different component naming conventions
  const ProductsComponent = 
    theme.components.ProductList || 
    theme.components.Home || 
    theme.components.Products

  if (!ProductsComponent) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Theme Error</h1>
        <p>The component "ProductList" was not found in theme "{tenantThemeKey}"</p>
      </div>
    )
  }

  return (
    <ProductsComponent
      tenant={tenant}
      products={products}
      categories={categories}
    />
  )
}
