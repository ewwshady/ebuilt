"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/schemas";

/**
 * Business Logic: Product Filtering & Sorting
 * Decoupled from UI - returns only filtered data
 */
export function useFilterLogic(products: Product[]) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "price-low-high" | "price-high-low">("newest");

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort((a, b) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        break;
      case "price-low-high":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortBy]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...uniqueCategories];
  }, [products]);

  // Get top 8 newest products
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 8);
  }, [products]);

  return {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredProducts,
    categories,
    topProducts,
  };
}
