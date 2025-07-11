
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, Profile, AIGeneration } from '@/types/database';

interface ProductWithProfile extends Product {
  profiles?: { full_name: string } | null;
}

interface AIGenerationWithDetails extends AIGeneration {
  profiles?: { full_name: string } | null;
  products?: { name: string } | null;
}

interface AnalyticsData {
  dailyStats: Array<{ date: string; users: number; products: number; aiUsage: number }>;
  categoryStats: Array<{ category: string; count: number }>;
  aiTypeStats: Array<{ type: string; count: number; color: string }>;
}

export function useAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalAIGenerations: 0,
    activeProducts: 0
  });
  const [products, setProducts] = useState<ProductWithProfile[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [aiGenerations, setAIGenerations] = useState<AIGenerationWithDetails[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    dailyStats: [],
    categoryStats: [],
    aiTypeStats: []
  });

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
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          const nextDayStr = nextDay.toISOString().split('T')[0];

          const [usersResult, productsResult, aiResult] = await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true })
              .gte('created_at', `${date}T00:00:00`)
              .lt('created_at', `${nextDayStr}T00:00:00`),
            supabase.from('products').select('*', { count: 'exact', head: true })
              .gte('created_at', `${date}T00:00:00`)
              .lt('created_at', `${nextDayStr}T00:00:00`),
            supabase.from('ai_generations').select('*', { count: 'exact', head: true })
              .gte('created_at', `${date}T00:00:00`)
              .lt('created_at', `${nextDayStr}T00:00:00`)
          ]);

          return {
            date: new Date(date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
            users: usersResult.count || 0,
            products: productsResult.count || 0,
            aiUsage: aiResult.count || 0
          };
        })
      );

      // Get category stats from real data
      const { data: categoryData } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);

      const categoryStats = categoryData?.reduce((acc: { category: string; count: number }[], product) => {
        if (!product.category) return acc;
        
        const existing = acc.find(item => item.category === product.category);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ category: product.category, count: 1 });
        }
        return acc;
      }, []) || [];

      // Get AI type stats from real data
      const { data: aiTypeData } = await supabase
        .from('ai_generations')
        .select('generation_type');

      const typeColors: { [key: string]: string } = {
        description: '#3b82f6',
        promotion: '#10b981',
        pricing: '#f59e0b',
        campaign: '#8b5cf6',
        schedule: '#f97316',
        custom: '#ec4899',
        tip: '#06b6d4'
      };

      const aiTypeStats = aiTypeData?.reduce((acc: { type: string; count: number; color: string }[], ai) => {
        const existing = acc.find(item => item.type === ai.generation_type);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ 
            type: ai.generation_type, 
            count: 1,
            color: typeColors[ai.generation_type] || '#6b7280'
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
      fetchAnalyticsData(); // Refresh analytics after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchProducts(),
      fetchUsers(),
      fetchAIGenerations(),
      fetchAnalyticsData()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    stats,
    products,
    users,
    aiGenerations,
    analyticsData,
    deleteProduct,
    refreshData,
    loading
  };
}
