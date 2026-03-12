import { notFound } from "next/navigation";
import { getDb } from "@/lib/mongodb"; // Switched to central utility
import { getTenantFromSubdomain, serializeTenant } from "@/lib/tenant-server";
import { themeRegistry } from "@/themes";
import type { ObjectId } from "mongodb";
import type { Product, Review } from "@/lib/schemas";

// --- Database fetchers ---

async function getProduct(tenantId: ObjectId, slug: string): Promise<Product | null> {
  const db = await getDb();
  return db.collection<Product>("products").findOne({
    tenantId,
    slug,
    status: "active",
  });
}

async function getProductReviews(tenantId: ObjectId, productId: ObjectId): Promise<Review[]> {
  const db = await getDb();
  return db
    .collection<Review>("reviews")
    .find({
      tenantId,
      productId,
      status: "approved",
    })
    .sort({ createdAt: -1 })
    .toArray();
}

// --- Normalization Helper ---

function serializeProductForTheme(product: any) {
  // Extract URL strings from the new object-based image schema
  const normalizedImages = (product.images || []).map((img: any) => {
    return typeof img === 'string' ? img : img.url;
  }).filter(Boolean);

  return {
    ...product,
    _id: product._id?.toString(),
    tenantId: product.tenantId?.toString(),
    // Convert dates to ISO strings safely
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : null,
    updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : null,
    
    // THE FIX: Theme expects an array of strings for images
    images: normalizedImages,
    // Provide 'image' as a single string for simple thumbnails
    image: normalizedImages[0] || "",
    
    // Provide the new schema raw data in case the theme is updated later
    rawImages: product.images || []
  };
}

// --- THE FINAL PAGE COMPONENT ---

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch tenant
  const tenantRaw = await getTenantFromSubdomain();
  if (!tenantRaw) notFound();

  // Fetch product
  const productRaw = await getProduct(
    tenantRaw._id as ObjectId,
    slug
  );
  if (!productRaw) notFound();

  // Fetch reviews
  const reviewsRaw = await getProductReviews(
    tenantRaw._id as ObjectId,
    productRaw._id as ObjectId
  );

  // Normalize all data for the Client Component (Theme)
  const tenant = serializeTenant(tenantRaw);
  const product = serializeProductForTheme(productRaw);
  
  // Simple JSON serialization for reviews
  const reviews = JSON.parse(JSON.stringify(reviewsRaw));

  // Get the theme component
  const themeKey = tenant.themeKey || "beauty-test";
  const theme = themeRegistry[themeKey] || themeRegistry["beauty-test"];
  const ProductDetailComponent = theme.components.ProductDetail;

  if (!ProductDetailComponent) {
      return (
          <div className="p-20 text-center">
              <h1 className="text-xl font-bold">Theme Component Missing</h1>
              <p>ProductDetail not found in {themeKey}</p>
          </div>
      )
  }

  return (
    <ProductDetailComponent
      tenant={tenant}
      product={product}
      reviews={reviews}
    />
  );
}
