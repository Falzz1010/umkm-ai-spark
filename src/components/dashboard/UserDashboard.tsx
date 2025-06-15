
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from './DashboardHeader';
import { ProductFinanceCards } from './ProductFinanceCards';
import { DashboardStatsCards } from './DashboardStatsCards';
import { TabProducts } from './TabProducts';
import { TabAnalytics } from './TabAnalytics';
import { TabAI } from './TabAI';
import { TabSales } from './TabSales';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useProductFinancials } from '@/hooks/useProductFinancials';
import { useProductExport } from '@/hooks/useProductExport';
import { Skeleton } from '@/components/ui/skeleton';

export function UserDashboard() {
  const { profile } = useAuth();
  const { 
    products, 
    stats, 
    salesKey, 
    setSalesKey, 
    analyticsData, 
    refreshData,
    loading
  } = useDashboardData();
  
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

  if (loading) {
    return (
      <div className="px-1 py-2 sm:px-4 lg:p-6 max-w-7xl mx-auto">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="flex flex-col gap-2 sm:gap-4 mb-2 sm:mb-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="px-1 py-2 sm:px-4 lg:p-6 max-w-7xl mx-auto">
      <DashboardHeader 
        title={`Selamat datang, ${profile?.full_name || 'User'}`}
        subtitle="Kelola produk dan dapatkan bantuan AI untuk bisnis Anda"
      />

      {/* Stat cards: pakai stacking & gap lebih rapat di mobile */}
      <div className="flex flex-col gap-2 sm:gap-4 mb-2 sm:mb-4">
        <ProductFinanceCards omzet={omzet} laba={laba} />
        <DashboardStatsCards stats={stats} />
      </div>

      {/* Tabs utama responsif, selalu tampil 4 kolom tab di semua ukuran layar */}
      <Tabs defaultValue="products" className="space-y-3">
        <TabsList
          className="
            w-full
            grid grid-cols-4 gap-1
            overflow-x-auto
            !mb-1
            "
          style={{ minWidth: 320 }}
        >
          <TabsTrigger value="products" className="text-xs xs:text-sm py-2 px-1 leading-tight">Produk Saya</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs xs:text-sm py-2 px-1 leading-tight">Analytics</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs xs:text-sm py-2 px-1 leading-tight">AI Assistant</TabsTrigger>
          <TabsTrigger value="sales" className="text-xs xs:text-sm py-2 px-1 leading-tight">Penjualan</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <div className="flex flex-col gap-3">
            <div className="w-full">
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
                handleExportExcel={() => handleExportExcel(products)}
                handleExportReport={() => handleExportReport(products)}
                refreshData={refreshData}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="mt-2">
            <TabAnalytics analyticsData={analyticsData} products={products} />
          </div>
        </TabsContent>
        <TabsContent value="ai">
          <div className="mt-2">
            <TabAI products={products} onGenerationComplete={refreshData} />
          </div>
        </TabsContent>
        <TabsContent value="sales">
          <div className="mt-2">
            <TabSales products={products} salesKey={salesKey} setSalesKey={setSalesKey} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
