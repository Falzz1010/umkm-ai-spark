
import { useProductFilters } from '@/hooks/useProductFilters';
import { useProductFinancials } from '@/hooks/useProductFinancials';
import { useProductExport } from '@/hooks/useProductExport';
import { Product } from '@/types/database';

export function useDashboardFilters(products: Product[]) {
  const {
    filterCategory,
    setFilterCategory,
    filterSearch,
    setFilterSearch,
    filterStatus,
    setFilterStatus,
    filterStok,
    setFilterStok,
    filteredProducts
  } = useProductFilters(products);

  const { omzet, laba } = useProductFinancials(products);
  const { handleExportExcel, handleExportReport } = useProductExport();

  return {
    filterCategory,
    setFilterCategory,
    filterSearch,
    setFilterSearch,
    filterStatus,
    setFilterStatus,
    filterStok,
    setFilterStok,
    filteredProducts,
    omzet,
    laba,
    handleExportExcel: () => handleExportExcel(products),
    handleExportReport: () => handleExportReport(products)
  };
}
