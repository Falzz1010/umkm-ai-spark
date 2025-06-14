
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, Bot, TrendingUp, Plus, Download, FileText } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { ProductList } from './ProductList';
import { EnhancedAIAssistant } from './EnhancedAIAssistant';
import { AddProductDialog } from './AddProductDialog';
import { AnalyticsCharts } from './AnalyticsCharts';
import { Product } from '@/types/database';
import { exportToExcel, generateProductReport } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';

export function UserDashboard() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    aiGenerations: 0
  });

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

  // Sample analytics data for charts
  const analyticsData = {
    dailyStats: [
      { date: '14 Jun', users: 12, products: 8, aiUsage: 24 },
      { date: '13 Jun', users: 15, products: 12, aiUsage: 32 },
      { date: '12 Jun', users: 8, products: 5, aiUsage: 18 },
      { date: '11 Jun', users: 20, products: 15, aiUsage: 45 },
      { date: '10 Jun', users: 18, products: 10, aiUsage: 38 },
      { date: '09 Jun', users: 22, products: 18, aiUsage: 52 },
      { date: '08 Jun', users: 16, products: 14, aiUsage: 28 }
    ],
    categoryStats: [
      { category: 'Makanan', count: 25 },
      { category: 'Fashion', count: 18 },
      { category: 'Elektronik', count: 12 },
      { category: 'Kerajinan', count: 15 },
      { category: 'Kosmetik', count: 8 }
    ],
    aiTypeStats: [
      { type: 'Deskripsi Produk', count: 45, color: '#3b82f6' },
      { type: 'Caption Promosi', count: 32, color: '#10b981' },
      { type: 'Saran Bisnis', count: 28, color: '#f59e0b' },
      { type: 'SEO Content', count: 15, color: '#ef4444' }
    ]
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <DashboardHeader 
        title={`Selamat datang, ${profile?.full_name || 'User'}`}
        subtitle="Kelola produk dan dapatkan bantuan AI untuk bisnis Anda"
      />

      {/* Stats Cards - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card className="bg-card border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Semua produk Anda</p>
          </CardContent>
        </Card>

        <Card className="bg-card border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProducts}</div>
            <p className="text-xs text-muted-foreground">Siap dipasarkan</p>
          </CardContent>
        </Card>

        <Card className="bg-card border sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aiGenerations}</div>
            <p className="text-xs text-muted-foreground">Total bantuan AI</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="products" className="text-sm">Produk Saya</TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="ai" className="text-sm">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Produk Saya</CardTitle>
                <CardDescription>Kelola produk bisnis Anda</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleExportExcel}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportReport}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Laporan
                </Button>
                <AddProductDialog onProductAdded={refreshData}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Produk
                </AddProductDialog>
              </div>
            </CardHeader>
            <CardContent>
              <ProductList products={products} onRefresh={refreshData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Analytics</CardTitle>
                <CardDescription>
                  Analisis performa bisnis dan aktivitas penggunaan platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsCharts data={analyticsData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <EnhancedAIAssistant products={products} onGenerationComplete={refreshData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
