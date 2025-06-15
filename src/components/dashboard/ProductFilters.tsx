
import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Product } from "@/types/database";
import { filter as lucideFilter, search as lucideSearch } from "lucide-react";

type ProductFiltersProps = {
  products: Product[];
  category: string;
  onCategoryChange: (category: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  showActive: string;
  onShowActiveChange: (val: string) => void;
  stokStatus: string;
  onStokStatusChange: (val: string) => void;
};

export function ProductFilters({
  products,
  category,
  onCategoryChange,
  search,
  onSearchChange,
  showActive,
  onShowActiveChange,
  stokStatus,
  onStokStatusChange,
}: ProductFiltersProps) {
  // Kategori unik
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  return (
    <div className="flex flex-col md:flex-row gap-2 md:items-end mb-4 bg-muted/60 px-3 py-2 rounded-md">
      {/* Pencarian */}
      <div className="flex-1 flex items-center gap-2">
        <lucideSearch className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama produk..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {/* Kategori */}
      <div className="min-w-[150px]">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat as string} value={cat as string}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Status Aktif */}
      <div className="min-w-[130px]">
        <Select value={showActive} onValueChange={onShowActiveChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Stok */}
      <div className="min-w-[120px]">
        <Select value={stokStatus} onValueChange={onStokStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Stok" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Stok</SelectItem>
            <SelectItem value="kosong">Stok Kosong</SelectItem>
            <SelectItem value="limit">Stok Sedikit (&lt;5)</SelectItem>
            <SelectItem value="ada">Stok Tersedia</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

