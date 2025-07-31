
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { GeminiInsight } from '@/types/gemini';
import { callGeminiAI } from '@/services/geminiService';
import { parseGeminiInsights, generateBasicInsights } from '@/utils/insightsParser';
import { buildBusinessContext } from '@/utils/businessContextBuilder';

export function useGeminiInsights(products: Product[]) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<GeminiInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const generateGeminiInsights = useCallback(async () => {
    if (!user || products.length === 0) return;

    setLoading(true);
    try {
      // Build comprehensive business context
      const businessContext = await buildBusinessContext(user, products);
      if (!businessContext) return;

      // Call Gemini AI for intelligent insights
      const aiText = await callGeminiAI(businessContext);

      if (aiText) {
        const aiInsights = parseGeminiInsights(aiText);
        setInsights(aiInsights);
      } else {
        // Fallback to basic insights if Gemini fails
        setInsights(generateBasicInsights(businessContext));
      }

    } catch (error) {
      console.error('Error generating Gemini insights:', error);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }, [user, products]);

  // Real-time subscriptions
  useEffect(() => {
    if (user && products.length > 0) {
      generateGeminiInsights();

      const channel = supabase
        .channel(`gemini-insights-${user.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'sales_transactions',
          filter: `user_id=eq.${user.id}`
        }, () => {
          console.log('Sales changed, refreshing Gemini insights...');
          setTimeout(generateGeminiInsights, 3000);
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${user.id}`
        }, () => {
          console.log('Products changed, refreshing Gemini insights...');
          setTimeout(generateGeminiInsights, 2000);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, products.length, generateGeminiInsights]);

  const dismissInsight = useCallback((insightId: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
  }, []);

  return {
    insights,
    loading,
    dismissInsight,
    refreshInsights: generateGeminiInsights
  };
}
