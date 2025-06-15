
import { useState, useMemo } from 'react';
import { Product } from '@/types/database';

export function useProductFilters(products: Product[]) {
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStok, setFilterStok] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Kategori
      if (filterCategory && p.category !== filterCategory) return false;
      // Status aktif
      if (filterStatus === "active" && !p.is_active) return false;
      if (filterStatus === "inactive" && p.is_active) return false;
      // Stok
      if (filterStok === "kosong" && (p.stock ?? 0) > 0) return false;
      if (filterStok === "limit" && !((p.stock ?? 0) > 0 && (p.stock ?? 0) < 5)) return false;
      if (filterStok === "ada" && (p.stock ?? 0) === 0) return false;
      // Pencarian (case insensitive)
      if (
        filterSearch &&
        !(p.name?.toLocaleLowerCase().includes(filterSearch.toLocaleLowerCase()))
      )
        return false;
      return true;
    });
  }, [products, filterCategory, filterSearch, filterStatus, filterStok]);

  return {
    filterCategory,
    setFilterCategory,
    filterSearch,
    setFilterSearch,
    filterStatus,
    setFilterStatus,
    filterStok,
    setFilterStok,
    filteredProducts
  };
}
