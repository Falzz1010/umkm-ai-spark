
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TabProducts } from '@/components/dashboard/TabProducts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { DashboardLoadingSkeleton } from '@/components/dashboard/DashboardLoadingSkeleton';

export default function ProductsPage() {
  const { products, refreshData, loading } = useDashboardData();
  
  const {
    filterCategory,
    setFilterCategory,
    filterSearch,
    setFilterSearch,
    filterStatus,
    setFilterStatus,
    filterStok,
    setFilterStok,
    filteredProducts,
    handleExportExcel,
    handleExportReport
  } = useDashboardFilters(products);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <DashboardHeader 
        title="Produk Saya"
        subtitle="Kelola dan monitor semua produk Anda"
      />
      
      <div className="bg-white dark:bg-card rounded-lg border shadow-sm p-3 sm:p-4 lg:p-6 w-full max-w-full overflow-hidden">
        <TabProducts
          products={products}
          filteredProducts={filteredProducts}
          filterCategory={filterCategory}
          filterSearch={filterSearch}
          filterStatus={filterStatus}
          filterStok={filterStok}
          setFilterCategory={setFilterCategory}
          setFilterSearch={setFilterSearch}
          setFilterStatus={setFilterStatus}
          setFilterStok={setFilterStok}
          handleExportExcel={handleExportExcel}
          handleExportReport={handleExportReport}
          refreshData={refreshData}
        />
      </div>
    </div>
  );
}
