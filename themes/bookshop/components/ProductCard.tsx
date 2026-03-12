"use client";

import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product, Tenant } from "@/lib/schemas";

interface ProductCardProps {
  product: Product;
  tenant: Tenant;
}

export function ProductCard({ product, tenant }: ProductCardProps) {
  return (
    <div className="group rounded-lg border border-amber-100 bg-white transition-all hover:shadow-lg">
      {/* Book Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg bg-gradient-to-br from-amber-100 to-yellow-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl">📖</span>
          </div>
        )}

        {/* Sale Badge */}
        {product.discount && (
          <div className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="line-clamp-2 font-serif text-lg font-semibold text-gray-900 group-hover:text-amber-700">
          <Link href={`/product/${product._id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Author (from description or category) */}
        <p className="mt-1 text-sm text-gray-500">
          {product.category || "Unknown Author"}
        </p>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-gray-500">(24)</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">
            Rs. {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              Rs. {product.originalPrice}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-lg bg-amber-600 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-700">
            <ShoppingCart className="inline h-4 w-4 mr-2" />
            Add to Cart
          </button>
          <button className="rounded-lg border border-amber-200 bg-white p-2 text-amber-600 transition-colors hover:bg-amber-50">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
