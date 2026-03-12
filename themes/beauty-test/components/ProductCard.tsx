'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
  stock: number;
  onAddToCart?: () => void;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  description,
  stock,
  onAddToCart,
}: ProductCardProps) {
  const isOutOfStock = stock === 0;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Image Container */}
      <CardContent className="relative h-48 overflow-hidden bg-gray-100 p-0">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute left-2 top-2 rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white">
            {category}
          </div>
        )}

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-sm font-bold text-white">Out of Stock</span>
          </div>
        )}
      </CardContent>

      {/* Content */}
      <CardFooter className="flex flex-col gap-3 border-t p-4">
        <div className="w-full">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{name}</h3>
          {description && (
            <p className="mt-1 text-xs text-gray-600 line-clamp-1">{description}</p>
          )}
        </div>

        {/* Price */}
        <div className="w-full">
          {/* <p className="text-lg font-bold text-pink-600">${price.toFixed(2)}</p> */}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
          disabled={isOutOfStock}
          onClick={onAddToCart}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
