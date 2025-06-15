
import { useState, useMemo, useCallback } from 'react';
import { Product } from '@/types/database';

interface ProductFilters {
  category: string;
  search: string;
  status: string;
  stock: string;
}

export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState<ProductFilters>({
    category: "",
    search: "",
    status: "",
    stock: ""
  });

  // Optimized filter function with early returns
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    return products.filter((product) => {
      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status === "active" && !product.is_active) {
        return false;
      }
      if (filters.status === "inactive" && product.is_active) {
        return false;
      }

      // Stock filter
      const stock = product.stock ?? 0;
      if (filters.stock === "kosong" && stock > 0) {
        return false;
      }
      if (filters.stock === "limit" && !(stock > 0 && stock < 5)) {
        return false;
      }
      if (filters.stock === "ada" && stock === 0) {
        return false;
      }

      // Search filter (case insensitive)
      if (filters.search && 
          !product.name?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  // Memoized filter setters
  const setFilterCategory = useCallback((category: string) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const setFilterSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const setFilterStatus = useCallback((status: string) => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const setFilterStok = useCallback((stock: string) => {
    setFilters(prev => ({ ...prev, stock }));
  }, []);

  return {
    filterCategory: filters.category,
    setFilterCategory,
    filterSearch: filters.search,
    setFilterSearch,
    filterStatus: filters.status,
    setFilterStatus,
    filterStok: filters.stock,
    setFilterStok,
    filteredProducts
  };
}
