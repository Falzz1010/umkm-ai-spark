import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, Bot, TrendingUp, Plus, Download, FileText, HandCoins, Calculator } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { ProductList } from './ProductList';
import { EnhancedAIAssistant } from './EnhancedAIAssistant';
import { AddProductDialog } from './AddProductDialog';
import { AnalyticsCharts } from './AnalyticsCharts';
import { Product } from '@/types/database';
import { exportToExcel, generateProductReport } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import { SalesTransactionsForm } from "./SalesTransactionsForm";
import { SalesTransactionsHistory } from "./SalesTransactionsHistory";
import { SalesOmzetChart } from "./SalesOmzetChart";
import { ProductFilters } from './ProductFilters';
import { ProductFinanceCards } from './ProductFinanceCards';
import { DashboardStatsCards } from './DashboardStatsCards';
import { TabProducts } from './TabProducts';
import { TabAnalytics } from './TabAnalytics';
import { TabAI } from './TabAI';
import { TabSales } from './TabSales';

export function UserDashboard() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { analyticsData, refreshAnalytics } = useUserAnalytics();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    aiGenerations: 0
  });
  const [salesKey, setSalesKey] = useState(0);

  // TAMBAH STATE FILTER
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStok, setFilterStok] = useState("");

  // BEGIN: Real-time subscription to product changes for current user (auto-refresh)
  useEffect(() => {
    if (!user) return;

    // create a supabase channel for product changes
    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Fetch products & stats when product belonging to user changes
          refreshData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // react to user.id only!
  }, [user?.id]); 
  // END: real-time

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchStats();
    }
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      const [productsResult, activeProductsResult, aiResult] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_active', true),
        supabase.from('ai_generations').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      ]);

      setStats({
        totalProducts: productsResult.count || 0,
        activeProducts: activeProductsResult.count || 0,
        aiGenerations: aiResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const refreshData = () => {
    fetchProducts();
    fetchStats();
    refreshAnalytics();
  };

  const handleExportExcel = () => {
    if (products.length === 0) {
      toast({
        title: "Tidak ada data",
        description: "Belum ada produk untuk diekspor.",
        variant: "destructive"
      });
      return;
    }

    exportToExcel(products, `produk_${profile?.full_name?.replace(/\s+/g, '_').toLowerCase()}`);
    toast({
      title: "Export Berhasil",
      description: "Data produk berhasil diekspor ke Excel!"
    });
  };

  const handleExportReport = () => {
    if (products.length === 0) {
      toast({
        title: "Tidak ada data",
        description: "Belum ada produk untuk dibuat laporan.",
        variant: "destructive"
      });
      return;
    }

    const report = generateProductReport(products);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan_produk_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Laporan Berhasil Dibuat",
      description: "Laporan produk berhasil diunduh!"
    });
  };

  // --- Perhitungan Omzet & Laba (hanya produk aktif)
  const { omzet, laba } = useMemo(() => {
    // Omzet = total harga produk aktif (harga*stock), Laba = (harga - HPP)*stock
    let totalOmzet = 0;
    let totalLaba = 0;
    products
      .filter((p) => p.is_active)
      .forEach((p) => {
        const price = Number(p.price) || 0;
        const cost = Number(p.cost) || 0;
        const stock = Number(p.stock) || 0;
        totalOmzet += price * stock;
        totalLaba += (price - cost) * stock;
      });
    return { omzet: totalOmzet, laba: totalLaba };
  }, [products]);

  // FILTER PRODUK
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

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <DashboardHeader 
        title={`Selamat datang, ${profile?.full_name || 'User'}`}
        subtitle="Kelola produk dan dapatkan bantuan AI untuk bisnis Anda"
      />

      {/* Kartu Statistik Keuangan */}
      <ProductFinanceCards omzet={omzet} laba={laba} />

      {/* Stats Cards - Mobile Responsive */}
      <DashboardStatsCards stats={stats} />

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="products" className="text-sm">Produk Saya</TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="ai" className="text-sm">AI Assistant</TabsTrigger>
          <TabsTrigger value="sales" className="text-sm">Penjualan</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
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
        </TabsContent>

        <TabsContent value="analytics">
          <TabAnalytics analyticsData={analyticsData} />
        </TabsContent>

        <TabsContent value="ai">
          <TabAI products={products} onGenerationComplete={refreshData} />
        </TabsContent>

        <TabsContent value="sales">
          <TabSales products={products} salesKey={salesKey} setSalesKey={setSalesKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// File ini sudah cukup panjang (235+ baris).
// Silakan pertimbangkan untuk meminta refaktor jika ingin kode lebih modular dan mudah dirawat.
