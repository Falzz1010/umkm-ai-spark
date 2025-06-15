
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { DashboardStats } from '@/types/dashboard';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

export function useDashboardData() {
  const { user } = useAuth();
  const { analyticsData, refreshAnalytics } = useUserAnalytics();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    aiGenerations: 0
  });
  const [salesKey, setSalesKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Memoized fetch functions to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    if (!user) return;

    try {
      console.log('Fetching products for user:', user.id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      console.log('Products fetched:', data?.length || 0);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      console.log('Fetching stats for user:', user.id);
      const [productsResult, activeProductsResult, aiResult] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_active', true),
        supabase.from('ai_generations').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      ]);

      const newStats: DashboardStats = {
        totalProducts: productsResult.count || 0,
        activeProducts: activeProductsResult.count || 0,
        aiGenerations: aiResult.count || 0
      };

      console.log('Stats fetched:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [user?.id]);

  // Optimized refresh function with debouncing
  const refreshData = useCallback(() => {
    console.log('Manual refresh triggered');
    fetchProducts();
    fetchStats();
    refreshAnalytics();
    setSalesKey(prev => prev + 1);
  }, [fetchProducts, fetchStats, refreshAnalytics]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchStats();
    }
  }, [user, fetchProducts, fetchStats]);

  // Memoized real-time subscription configs
  const subscriptionConfigs = useMemo(() => {
    if (!user) return [];

    return [
      {
        table: 'products',
        event: '*' as const,
        filter: `user_id=eq.${user.id}`,
        callback: () => {
          fetchProducts();
          fetchStats();
          refreshAnalytics();
        }
      },
      {
        table: 'sales_transactions',
        event: '*' as const,
        filter: `user_id=eq.${user.id}`,
        callback: () => {
          // Pastikan setiap kali terjadi transaksi penjualan, produk juga di-refresh!
          fetchProducts();
          fetchStats();
          refreshAnalytics();
          setSalesKey(prev => prev + 1);
        }
      },
      {
        table: 'ai_generations',
        event: '*' as const,
        filter: `user_id=eq.${user.id}`,
        callback: () => {
          fetchStats();
        }
      }
    ];
  }, [user?.id, fetchProducts, fetchStats, refreshAnalytics]);

  // Use the reusable real-time subscription hook
  useRealtimeSubscription(subscriptionConfigs, [user?.id]);

  return {
    products,
    stats,
    salesKey,
    setSalesKey,
    analyticsData,
    refreshData,
    loading
  };
}
