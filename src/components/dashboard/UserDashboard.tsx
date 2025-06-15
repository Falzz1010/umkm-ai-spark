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

  const { handleExportExcel, handleExportReport } = useProductExport();

  if (loading) {
    return (
      <div className="px-1 py-2 sm:px-4 lg:p-6 max-w-7xl mx-auto">
        <div className="space-y-4 animate-slide-up">
          <Skeleton className="h-12 w-64 shadow-smooth" />
          <Skeleton className="h-6 w-40 shadow-smooth" />
        </div>
        <div className="flex flex-col gap-2 sm:gap-4 mb-2 sm:mb-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 stagger-children">
            <Skeleton className="h-24 shadow-smooth animate-slide-in-left" style={{'--index': 0} as any} />
            <Skeleton className="h-24 shadow-smooth animate-slide-in-right" style={{'--index': 1} as any} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 stagger-children">
            <Skeleton className="h-24 shadow-smooth animate-slide-in-left" style={{'--index': 0} as any} />
            <Skeleton className="h-24 shadow-smooth animate-slide-up" style={{'--index': 1} as any} />
            <Skeleton className="h-24 shadow-smooth animate-slide-in-right" style={{'--index': 2} as any} />
          </div>
        </div>
        <Skeleton className="h-96 w-full shadow-smooth animate-fade-in" />
      </div>
    );
  }

  return (
    <div className="px-1 py-2 sm:px-4 lg:p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="animate-slide-up">
        <DashboardHeader 
          title={`Selamat datang, ${profile?.full_name || 'User'}`}
          subtitle="Kelola produk dan dapatkan bantuan AI untuk bisnis Anda"
        />
      </div>
      {/* Stat cards dengan animasi stagger */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 stagger-children">
        <div className="animate-bounce-subtle animate-slide-in-left" style={{'--index': 0} as any}>
          <ProductFinanceCards />
        </div>
        <div className="animate-slide-in-right animate-scale-in" style={{'--index': 1} as any}>
          <DashboardStatsCards stats={stats} />
        </div>
      </div>
      {/* Tabs dengan animasi smooth */}
      <div className="animate-fade-in animate-slide-up" style={{'--index': 2} as any}>
        <Tabs defaultValue="products" className="space-y-6 transition-all duration-300">
          <TabsList
            className="
              w-full
              grid grid-cols-2 sm:grid-cols-4 gap-2
              bg-gradient-to-r from-background/80 to-muted/40
              backdrop-blur-sm
              border border-border/50
              rounded-xl
              p-2
              shadow-lg
              hover:shadow-xl
              transition-all duration-300
              min-h-[3.5rem]
              animate-fade-in
              "
          >
            <TabsTrigger 
              value="products" 
              className="
                text-xs sm:text-sm 
                py-3 px-3 
                leading-tight 
                rounded-lg
                transition-all duration-200
                font-medium
                data-[state=active]:bg-primary
                data-[state=active]:text-primary-foreground
                data-[state=active]:shadow-md
                hover:bg-muted/60
                whitespace-nowrap
                overflow-hidden
              "
            >
              Produk Saya
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="
                text-xs sm:text-sm 
                py-3 px-3 
                leading-tight 
                rounded-lg
                transition-all duration-200
                font-medium
                data-[state=active]:bg-primary
                data-[state=active]:text-primary-foreground
                data-[state=active]:shadow-md
                hover:bg-muted/60
                whitespace-nowrap
                overflow-hidden
              "
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="
                text-xs sm:text-sm 
                py-3 px-3 
                leading-tight 
                rounded-lg
                transition-all duration-200
                font-medium
                data-[state=active]:bg-primary
                data-[state=active]:text-primary-foreground
                data-[state=active]:shadow-md
                hover:bg-muted/60
                whitespace-nowrap
                overflow-hidden
              "
            >
              AI Assistant
            </TabsTrigger>
            <TabsTrigger 
              value="sales" 
              className="
                text-xs sm:text-sm 
                py-3 px-3 
                leading-tight 
                rounded-lg
                transition-all duration-200
                font-medium
                data-[state=active]:bg-primary
                data-[state=active]:text-primary-foreground
                data-[state=active]:shadow-md
                hover:bg-muted/60
                whitespace-nowrap
                overflow-hidden
              "
            >
              Penjualan
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="animate-fade-in animate-slide-up mt-4 transition-all duration-300">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border shadow-smooth p-4 animate-scale-in">
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
          </TabsContent>
          
          <TabsContent value="analytics" className="animate-fade-in animate-slide-in-right mt-4 transition-all duration-300">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border shadow-smooth p-4 animate-scale-in">
              <TabAnalytics analyticsData={analyticsData} products={products} />
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="animate-fade-in animate-slide-in-left mt-4 transition-all duration-300">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border shadow-smooth p-4 animate-scale-in">
              <TabAI products={products} onGenerationComplete={refreshData} />
            </div>
          </TabsContent>
          
          <TabsContent value="sales" className="animate-fade-in animate-slide-up mt-4 transition-all duration-300">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border shadow-smooth p-4 animate-scale-in">
              <TabSales products={products} salesKey={salesKey} setSalesKey={setSalesKey} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
