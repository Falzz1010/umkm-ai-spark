
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabProducts } from './TabProducts';
import { TabAnalytics } from './TabAnalytics';
import { TabAI } from './TabAI';
import { TabSales } from './TabSales';
import { Product } from '@/types/database';
import { DashboardStats } from '@/types/dashboard';

interface DashboardTabsProps {
  products: Product[];
  stats: DashboardStats;
  salesKey: number;
  setSalesKey: (v: (v: number) => number) => void;
  analyticsData: any;
  filteredProducts: Product[];
  filterCategory: string;
  filterSearch: string;
  filterStatus: string;
  filterStok: string;
  setFilterCategory: (value: string) => void;
  setFilterSearch: (value: string) => void;
  setFilterStatus: (value: string) => void;
  setFilterStok: (value: string) => void;
  handleExportExcel: () => void;
  handleExportReport: () => void;
  refreshData: () => void;
}

export function DashboardTabs({
  products,
  salesKey,
  setSalesKey,
  analyticsData,
  filteredProducts,
  filterCategory,
  filterSearch,
  filterStatus,
  filterStok,
  setFilterCategory,
  setFilterSearch,
  setFilterStatus,
  setFilterStok,
  handleExportExcel,
  handleExportReport,
  refreshData
}: DashboardTabsProps) {
  return (
    <div className="animate-fade-in animate-slide-up" style={{'--index': 2} as any}>
      <Tabs defaultValue="products" className="space-y-6 transition-all duration-300">
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gradient-to-r from-background/80 to-muted/40 backdrop-blur-sm border border-border/50 rounded-xl p-2 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[3.5rem] animate-fade-in">
          <TabsTrigger 
            value="products" 
            className="text-xs sm:text-sm py-3 px-3 leading-tight rounded-lg transition-all duration-200 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/60 whitespace-nowrap overflow-hidden"
          >
            Produk Saya
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="text-xs sm:text-sm py-3 px-3 leading-tight rounded-lg transition-all duration-200 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/60 whitespace-nowrap overflow-hidden"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="ai" 
            className="text-xs sm:text-sm py-3 px-3 leading-tight rounded-lg transition-all duration-200 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/60 whitespace-nowrap overflow-hidden"
          >
            AI Assistant
          </TabsTrigger>
          <TabsTrigger 
            value="sales" 
            className="text-xs sm:text-sm py-3 px-3 leading-tight rounded-lg transition-all duration-200 font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/60 whitespace-nowrap overflow-hidden"
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
              handleExportExcel={handleExportExcel}
              handleExportReport={handleExportReport}
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
  );
}
