"use client";

import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product, Tenant } from "@/lib/schemas";

interface ProductCardProps {
  product: Product;
  tenant: Tenant;
}

export function ProductCard({ product, tenant }: ProductCardProps) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg hover:border-blue-300">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gradient-to-br from-slate-100 to-slate-200">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Zap className="h-12 w-12 text-slate-400" />
          </div>
        )}

        {/* Badge */}
        {product.discount && (
          <div className="absolute right-3 top-3 rounded-lg bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            Save {product.discount}%
          </div>
        )}

        {/* Stock Status */}
        {product.stock && product.stock < 10 && (
          <div className="absolute left-3 top-3 rounded-lg bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            Low Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          <Link href={`/product/${product._id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Category */}
        <p className="mt-1 text-sm text-gray-500">
          {product.category}
        </p>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-gray-500">(128)</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            Rs. {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              Rs. {product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock Indicator */}
        {product.stock && (
          <div className="mt-2 text-xs font-medium">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock: {product.stock} units</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 active:scale-95">
            <ShoppingCart className="inline h-4 w-4 mr-2" />
            Add to Cart
          </button>
          <button className="rounded-lg border border-slate-200 bg-white p-2 text-gray-600 transition-colors hover:bg-slate-50 hover:text-red-500">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
