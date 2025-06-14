
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Package, TrendingUp, Bot } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
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

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchUsers();
    fetchAIGenerations();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResult, productsResult, aiResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('products').select('*', { count: 'exact' }),
        supabase.from('ai_generations').select('*', { count: 'exact' })
      ]);

      const activeProductsResult = await supabase
        .from('products')
        .select('*', { count: 'exact' })
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
      // First get products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (productsData) {
        // Then get profiles for each product's user_id
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
      // First get AI generations
      const { data: aiData } = await supabase
        .from('ai_generations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (aiData) {
        // Then get profiles and products for each generation
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
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardHeader 
        title="Dashboard Admin"
        subtitle="Kelola pengguna dan monitor aktivitas platform"
        onSignOut={signOut}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAIGenerations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Produk</TabsTrigger>
          <TabsTrigger value="users">Pengguna</TabsTrigger>
          <TabsTrigger value="ai">AI Generations</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Produk Terbaru</CardTitle>
              <CardDescription>Daftar produk yang baru ditambahkan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category || 'Kategori tidak diset'}</p>
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
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{user.full_name}</h3>
                      <p className="text-sm text-gray-600">{user.business_name || 'Belum diset'}</p>
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
                    <div className="flex items-center justify-between mb-2">
                      <Badge>{generation.generation_type}</Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(generation.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
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
