// themes/beauty-test/ProductList.tsx

"use client"; // <-- CHANGE #1: Mark this as a Client Component.

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Filter, Grid, List, ChevronDown } from "lucide-react";
import { ProductCard } from "./components/ProductCard";

// REMOVED: Data fetching imports are no longer needed here.
// import { getTenantBySubdomain, getProductsByTenant } from "@/lib/data-fetchers";

import type { Product, Tenant, Category } from "@/lib/schemas"; // <-- CHANGE #2: Import types for props.

// CHANGE #3: Update props to receive all data from the parent Server Component.
interface ProductListProps {
  tenant: Tenant;
  products: Product[];
  categories: Category[];
}

// CHANGE #4: Remove 'async' keyword. This is no longer a Server Component.
export function ProductList({ tenant, products, categories }: ProductListProps) {
  // REMOVED: All data fetching logic is gone. The component now relies entirely on props.
  // const tenant = await getTenantBySubdomain(tenantSubdomain);
  // const products = await getProductsByTenant(tenant._id);
  // const categories = ...

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header tenant={tenant} />
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-serif text-gray-900">Shop All Products</h1>
          <p className="text-gray-600">
            Discover {products.length} premium beauty products
          </p>
        </div>

        {/* Filters and Controls (This is interactive UI, which is why "use client" is needed) */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md hover:shadow-lg">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            
            <div className="relative">
              <select className="appearance-none rounded-full bg-white px-4 py-2 pr-8 shadow-md hover:shadow-lg">
                <option>Sort by: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category.name}
                  className="rounded-full bg-white px-4 py-2 text-sm shadow-md hover:shadow-lg"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-md">
            <button className="rounded-full bg-pink-50 p-2">
              <Grid className="h-4 w-4 text-pink-600" />
            </button>
            <button className="rounded-full p-2 hover:bg-gray-100">
              <List className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id.toString()}
              product={product}
              tenant={tenant}
            />
          ))}
        </div>

        {/* Pagination and Empty State logic remains the same... */}
        {products.length > 0 && (
          <div className="mt-12 flex justify-center">{/* ... */}</div>
        )}
        {products.length === 0 && (
          <div className="py-20 text-center">{/* ... */}</div>
        )}
      </div>
      <Footer tenant={tenant} />
    </div>
  );
}
