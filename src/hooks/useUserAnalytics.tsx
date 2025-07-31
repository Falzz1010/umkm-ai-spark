
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  dailyStats: Array<{ date: string; users: number; products: number; aiUsage: number }>;
  categoryStats: Array<{ category: string; count: number }>;
  aiTypeStats: Array<{ type: string; count: number; color: string }>;
}

export function useUserAnalytics() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    dailyStats: [],
    categoryStats: [],
    aiTypeStats: []
  });

  const fetchUserAnalytics = async () => {
    if (!user) return;

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

          const [productsResult, aiResult] = await Promise.all([
            supabase.from('products').select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .gte('created_at', `${date}T00:00:00`)
              .lt('created_at', `${nextDayStr}T00:00:00`),
            supabase.from('ai_generations').select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .gte('created_at', `${date}T00:00:00`)
              .lt('created_at', `${nextDayStr}T00:00:00`)
          ]);

          return {
            date: new Date(date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
            users: 0, // For user dashboard, we don't track new users per day, so set to 0
            products: productsResult.count || 0,
            aiUsage: aiResult.count || 0
          };
        })
      );

      // Get user's category stats
      const { data: categoryData } = await supabase
        .from('products')
        .select('category')
        .eq('user_id', user.id)
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

      // Get user's AI type stats
      const { data: aiTypeData } = await supabase
        .from('ai_generations')
        .select('generation_type')
        .eq('user_id', user.id);

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
      console.error('Error fetching user analytics:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAnalytics();
    }
  }, [user]);

  return {
    analyticsData,
    refreshAnalytics: fetchUserAnalytics
  };
}
