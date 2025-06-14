import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Package, TrendingUp, Bot, BarChart3 } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { AnalyticsCharts } from './AnalyticsCharts';
import { Product, Profile, AIGeneration } from '@/types/database';

interface ProductWithProfile extends Product {
  profiles?: { full_name: string } | null;
}

interface AIGenerationWithDetails extends AIGeneration {
  profiles?: { full_name: string } | null;
  products?: { name: string } | null;
}

export function AdminDashboard() {
  const { signOut } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalAIGenerations: 0,
    activeProducts: 0
  });
  const [products, setProducts] = useState<ProductWithProfile[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [aiGenerations, setAIGenerations] = useState<AIGenerationWithDetails[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    dailyStats: [],
    categoryStats: [],
    aiTypeStats: []
  });

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchUsers();
    fetchAIGenerations();
    fetchAnalyticsData();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResult, productsResult, aiResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('ai_generations').select('*', { count: 'exact', head: true })
      ]);

      const activeProductsResult = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats({
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalAIGenerations: aiResult.count || 0,
        activeProducts: activeProductsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (productsData) {
        const productsWithProfiles = await Promise.all(
          productsData.map(async (product) => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', product.user_id)
              .single();

            return {
              ...product,
              profiles: profileData
            };
          })
        );

        setProducts(productsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAIGenerations = async () => {
    try {
      const { data: aiData } = await supabase
        .from('ai_generations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (aiData) {
        const aiWithDetails = await Promise.all(
          aiData.map(async (ai) => {
            const [profileResult, productResult] = await Promise.all([
              supabase
                .from('profiles')
                .select('full_name')
                .eq('id', ai.user_id)
                .single(),
              ai.product_id
                ? supabase
                    .from('products')
                    .select('name')
                    .eq('id', ai.product_id)
                    .single()
                : Promise.resolve({ data: null })
            ]);

            return {
              ...ai,
              profiles: profileResult.data,
              products: productResult.data
            };
          })
        );

        setAIGenerations(aiWithDetails);
      }
    } catch (error) {
      console.error('Error fetching AI generations:', error);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      // Get last 7 days data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const dailyStats = await Promise.all(
        last7Days.map(async (date) => {
          const [usersResult, productsResult, aiResult] = await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', date).lt('created_at', date + 'T23:59:59'),
            supabase.from('products').select('*', { count: 'exact', head: true }).gte('created_at', date).lt('created_at', date + 'T23:59:59'),
            supabase.from('ai_generations').select('*', { count: 'exact', head: true }).gte('created_at', date).lt('created_at', date + 'T23:59:59')
          ]);

          return {
            date: new Date(date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
            users: usersResult.count || 0,
            products: productsResult.count || 0,
            aiUsage: aiResult.count || 0
          };
        })
      );

      // Get category stats
      const { data: categoryData } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);

      const categoryStats = categoryData?.reduce((acc: any[], product) => {
        const existing = acc.find(item => item.category === product.category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ category: product.category, count: 1 });
        }
        return acc;
      }, []) || [];

      // Get AI type stats
      const { data: aiTypeData } = await supabase
        .from('ai_generations')
        .select('generation_type');

      const typeColors = {
        description: '#3b82f6',
        promotion: '#10b981',
        pricing: '#f59e0b',
        campaign: '#8b5cf6',
        schedule: '#f97316',
        custom: '#ec4899'
      };

      const aiTypeStats = aiTypeData?.reduce((acc: any[], ai) => {
        const existing = acc.find(item => item.type === ai.generation_type);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ 
            type: ai.generation_type, 
            count: 1,
            color: typeColors[ai.generation_type as keyof typeof typeColors] || '#6b7280'
          });
        }
        return acc;
      }, []) || [];

      setAnalyticsData({
        dailyStats,
        categoryStats,
        aiTypeStats
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await supabase.from('products').delete().eq('id', productId);
      fetchProducts();
      fetchStats();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <DashboardHeader 
        title="Dashboard Admin"
        subtitle="Kelola pengguna dan monitor aktivitas platform"
      />

      {/* Stats Cards - Mobile Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.activeProducts}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
            <Bot className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.totalAIGenerations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="analytics" className="text-xs lg:text-sm">
            <BarChart3 className="h-4 w-4 mr-1 lg:mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="products" className="text-xs lg:text-sm">Produk</TabsTrigger>
          <TabsTrigger value="users" className="text-xs lg:text-sm">Pengguna</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs lg:text-sm">AI</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>Visualisasi data dan tren aktivitas platform</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsCharts data={analyticsData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Produk Terbaru</CardTitle>
              <CardDescription>Daftar produk yang baru ditambahkan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-2 lg:space-y-0">
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product.category || 'Kategori tidak diset'}</p>
                      <p className="text-sm text-gray-500">
                        Harga: Rp {product.price?.toLocaleString() || 'Belum diset'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Oleh: {product.profiles?.full_name || 'Unknown User'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Pengguna Terbaru</CardTitle>
              <CardDescription>Daftar pengguna yang baru mendaftar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-2 lg:space-y-0">
                    <div>
                      <h3 className="font-medium">{user.full_name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.business_name || 'Belum diset'}</p>
                      <p className="text-sm text-gray-500">{user.phone || 'Belum diset'}</p>
                    </div>
                    <Badge variant="outline">
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Generations Terbaru</CardTitle>
              <CardDescription>Aktivitas penggunaan AI terbaru</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiGenerations.map((generation) => (
                  <div key={generation.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2 space-y-1 lg:space-y-0">
                      <Badge>{generation.generation_type}</Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(generation.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {generation.generated_content}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Oleh: {generation.profiles?.full_name || 'Unknown User'}
                      {generation.products && (
                        <span> • Produk: {generation.products.name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
