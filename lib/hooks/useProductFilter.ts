'use client';

import { useMemo, useState, useCallback } from 'react';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock: number;
  status: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string | null;
  priceRange: [number, number];
  sortBy: 'newest' | 'price-low' | 'price-high' | 'name';
}

export function useProductFilter(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: null,
    priceRange: [0, 10000],
    sortBy: 'newest',
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filters.selectedCategory) {
      result = result.filter((product) => product.category === filters.selectedCategory);
    }

    // Filter by price range
    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        // Assuming products are already sorted by date from server
        break;
    }

    return result;
  }, [products, filters]);

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
  }, [products]);

  const updateSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const updateCategory = useCallback((category: string | null) => {
    setFilters((prev) => ({ ...prev, selectedCategory: category }));
  }, []);

  const updatePriceRange = useCallback((range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  }, []);

  const updateSortBy = useCallback((sortBy: FilterState['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      selectedCategory: null,
      priceRange: [0, 10000],
      sortBy: 'newest',
    });
  }, []);

  return {
    filters,
    filteredProducts,
    categories,
    updateSearchQuery,
    updateCategory,
    updatePriceRange,
    updateSortBy,
    resetFilters,
  };
}
