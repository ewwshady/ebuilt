'use client'

import { ProductCard } from './ProductCard'
import type { Product } from '@/lib/schemas'

interface ProductListProps {
  products: Product[]
  wishlistIds: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onWishlistToggle: (productId: string) => void
  onAddToCart: (product: Product) => void
  categories: { name: string; count: number }[]
  isLoading?: boolean
}

export function ProductList({
  products,
  wishlistIds,
  selectedCategory,
  onCategoryChange,
  onWishlistToggle,
  onAddToCart,
  categories,
  isLoading,
}: ProductListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Sidebar - Categories */}
      <aside className="lg:col-span-1">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange('All')}
              className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                selectedCategory === 'All'
                  ? 'bg-pink-100 text-pink-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onCategoryChange(cat.name)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition flex justify-between items-center ${
                  selectedCategory === cat.name
                    ? 'bg-pink-100 text-pink-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs bg-gray-200 rounded-full px-2 py-1">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main - Products Grid */}
      <div className="lg:col-span-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg aspect-square animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id?.toString()}
                product={product}
                isWishlisted={wishlistIds.includes(product._id?.toString() || '')}
                onWishlistToggle={() => onWishlistToggle(product._id?.toString() || '')}
                onAddToCart={() => onAddToCart(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
