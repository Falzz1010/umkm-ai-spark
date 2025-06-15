
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';

export function useDashboardData() {
  const { user } = useAuth();
  const { analyticsData, refreshAnalytics } = useUserAnalytics();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    aiGenerations: 0
  });
  const [salesKey, setSalesKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchStats();
    }
  }, [user]);

  // Real-time subscription untuk products
  useEffect(() => {
    if (!user) return;

    console.log('Setting up products real-time subscription for user:', user.id);

    const channel = supabase
      .channel(`products-realtime-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time product change:', payload);
          fetchProducts();
          fetchStats();
          refreshAnalytics();
        }
      )
      .subscribe((status) => {
        console.log('Products subscription status:', status);
      });

    return () => {
      console.log('Cleaning up products subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Real-time subscription untuk sales_transactions
  useEffect(() => {
    if (!user) return;

    console.log('Setting up sales real-time subscription for user:', user.id);

    const salesChannel = supabase
      .channel(`sales-realtime-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales_transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time sales change:', payload);
          fetchProducts();
          fetchStats();
          refreshAnalytics();
          setSalesKey(prev => prev + 1);
        }
      )
      .subscribe((status) => {
        console.log('Sales subscription status:', status);
      });

    return () => {
      console.log('Cleaning up sales subscription');
      supabase.removeChannel(salesChannel);
    };
  }, [user?.id]);

  // Real-time subscription untuk AI generations
  useEffect(() => {
    if (!user) return;

    console.log('Setting up AI generations real-time subscription for user:', user.id);

    const aiChannel = supabase
      .channel(`ai-generations-realtime-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_generations',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time AI generation change:', payload);
          fetchStats();
        }
      )
      .subscribe((status) => {
        console.log('AI generations subscription status:', status);
      });

    return () => {
      console.log('Cleaning up AI generations subscription');
      supabase.removeChannel(aiChannel);
    };
  }, [user?.id]);

  const fetchProducts = async () => {
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
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      console.log('Fetching stats for user:', user.id);
      const [productsResult, activeProductsResult, aiResult] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_active', true),
        supabase.from('ai_generations').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      ]);

      const newStats = {
        totalProducts: productsResult.count || 0,
        activeProducts: activeProductsResult.count || 0,
        aiGenerations: aiResult.count || 0
      };

      console.log('Stats fetched:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const refreshData = () => {
    console.log('Manual refresh triggered');
    fetchProducts();
    fetchStats();
    refreshAnalytics();
    setSalesKey(prev => prev + 1);
  };

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
