
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabProducts } from './TabProducts';
import { TabAnalytics } from './TabAnalytics';
import { TabAI } from './TabAI';
import { TabSales } from './TabSales';
import { TabPricing } from './TabPricing';
import { Product } from '@/types/database';
import { DashboardStats } from '@/types/dashboard';
import { Package, ShoppingCart, BarChart3, Bot, DollarSign, Brain } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

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
  stats,
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
  const { updateProduct } = useUserData();

  const handlePriceUpdate = async (productId: string, newPrice: number) => {
    try {
      await updateProduct(productId, { price: newPrice });
      refreshData();
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  return (
    <div className="animate-slide-up" style={{'--index': 3} as any}>
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Produk</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Penjualan</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analitik</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
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
        
        <TabsContent value="sales" className="animate-fade-in animate-slide-up mt-4 transition-all duration-300">
          <div className="bg-card/50 backdrop-blur-sm rounded-lg border shadow-smooth p-4 animate-scale-in">
            <TabSales products={products} salesKey={salesKey} setSalesKey={setSalesKey} />
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
        
        <TabsContent value="pricing" className="space-y-6">
          <TabPricing 
            products={products}
            onPriceUpdate={handlePriceUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
