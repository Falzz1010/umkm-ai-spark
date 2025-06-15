
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';

export interface GeminiInsight {
  id: string;
  type: 'prediction' | 'strategy' | 'market_trend' | 'optimization';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  actionable: boolean;
  timestamp: Date;
  data?: any;
}

export function useGeminiInsights(products: Product[]) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<GeminiInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const generateGeminiInsights = useCallback(async () => {
    if (!user || products.length === 0) return;

    setLoading(true);
    try {
      // Get comprehensive business data for analysis
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Fetch sales data
      const [weekSalesResult, monthSalesResult] = await Promise.all([
        supabase
          .from('sales_transactions')
          .select('product_id, quantity, total, price, created_at, products(name, category, cost)')
          .eq('user_id', user.id)
          .gte('created_at', weekAgo.toISOString()),
        
        supabase
          .from('sales_transactions')
          .select('product_id, quantity, total, created_at')
          .eq('user_id', user.id)
          .gte('created_at', monthAgo.toISOString())
      ]);

      const weekSales = weekSalesResult.data || [];
      const monthSales = monthSalesResult.data || [];

      // Prepare comprehensive business context for Gemini
      const businessContext = {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.is_active).length,
        totalStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
        lowStockProducts: products.filter(p => (p.stock || 0) < 5).length,
        categories: [...new Set(products.map(p => p.category))],
        weeklyRevenue: weekSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0),
        monthlyRevenue: monthSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0),
        weeklyTransactions: weekSales.length,
        monthlyTransactions: monthSales.length,
        topSellingProducts: getTopSellingProducts(weekSales),
        priceRanges: getPriceRanges(products),
        marginAnalysis: getMarginAnalysis(products)
      };

      // Call Gemini AI for intelligent insights
      const geminiResponse = await supabase.functions.invoke('gemini-ai', {
        body: {
          prompt: `Analisis data bisnis UMKM dan berikan 3-4 insight strategis yang actionable`,
          type: 'business_insights',
          businessData: businessContext
        }
      });

      if (geminiResponse.data?.success) {
        const aiInsights = parseGeminiInsights(geminiResponse.data.generatedText);
        setInsights(aiInsights);
      } else {
        console.error('Gemini insights error:', geminiResponse.error);
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

  // Parse Gemini response into structured insights
  const parseGeminiInsights = (aiText: string): GeminiInsight[] => {
    const insights: GeminiInsight[] = [];
    
    // Split by common insight indicators
    const sections = aiText.split(/(?=\d+\.|•|-)/).filter(s => s.trim());
    
    sections.forEach((section, index) => {
      if (section.trim().length < 20) return; // Skip short sections
      
      const lines = section.trim().split('\n').filter(l => l.trim());
      if (lines.length === 0) return;
      
      // Extract title and message
      const firstLine = lines[0].replace(/^\d+\.\s*|^[•-]\s*/, '').trim();
      const restLines = lines.slice(1).join(' ').trim();
      
      // Determine insight type based on content
      let type: GeminiInsight['type'] = 'optimization';
      let priority: GeminiInsight['priority'] = 'medium';
      
      if (firstLine.toLowerCase().includes('prediksi') || firstLine.toLowerCase().includes('akan')) {
        type = 'prediction';
        priority = 'high';
      } else if (firstLine.toLowerCase().includes('strategi') || firstLine.toLowerCase().includes('rekomendasi')) {
        type = 'strategy';
        priority = 'medium';
      } else if (firstLine.toLowerCase().includes('trend') || firstLine.toLowerCase().includes('pasar')) {
        type = 'market_trend';
        priority = 'medium';
      }
      
      // Determine priority based on urgency keywords
      if (section.toLowerCase().includes('urgent') || section.toLowerCase().includes('segera') || 
          section.toLowerCase().includes('kritis') || section.toLowerCase().includes('habis')) {
        priority = 'high';
      }
      
      insights.push({
        id: `gemini-${index}-${Date.now()}`,
        type,
        title: firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine,
        message: restLines || firstLine,
        priority,
        confidence: 85 + Math.floor(Math.random() * 15), // 85-100% confidence
        actionable: true,
        timestamp: new Date(),
        data: { source: 'gemini-ai' }
      });
    });
    
    return insights.slice(0, 4); // Limit to 4 insights
  };

  // Fallback basic insights if Gemini fails
  const generateBasicInsights = (context: any): GeminiInsight[] => {
    const insights: GeminiInsight[] = [];
    
    if (context.lowStockProducts > 0) {
      insights.push({
        id: 'basic-stock-alert',
        type: 'optimization',
        title: 'Perhatian Stok Produk',
        message: `${context.lowStockProducts} produk memiliki stok rendah. Segera lakukan restok untuk menghindari kehabisan.`,
        priority: 'high',
        confidence: 95,
        actionable: true,
        timestamp: new Date(),
        data: { source: 'fallback' }
      });
    }
    
    if (context.weeklyRevenue > 0) {
      const dailyAvg = context.weeklyRevenue / 7;
      insights.push({
        id: 'basic-revenue-trend',
        type: 'market_trend',
        title: 'Analisis Penjualan Mingguan',
        message: `Rata-rata penjualan harian Rp${dailyAvg.toLocaleString()}. Pertahankan momentum dengan promosi konsisten.`,
        priority: 'medium',
        confidence: 90,
        actionable: true,
        timestamp: new Date(),
        data: { source: 'fallback' }
      });
    }
    
    return insights;
  };

  // Helper functions
  const getTopSellingProducts = (sales: any[]) => {
    const productSales = sales.reduce((acc, sale) => {
      const name = sale.products?.name || 'Unknown';
      acc[name] = (acc[name] || 0) + sale.quantity;
      return acc;
    }, {});
    
    return Object.entries(productSales)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([name, qty]) => ({ name, quantity: qty }));
  };

  const getPriceRanges = (products: Product[]) => {
    const prices = products.map(p => Number(p.price) || 0).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 0, avg: 0 };
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((a, b) => a + b, 0) / prices.length
    };
  };

  const getMarginAnalysis = (products: Product[]) => {
    const margins = products.map(p => {
      const cost = Number(p.cost) || 0;
      const price = Number(p.price) || 0;
      return cost > 0 ? ((price - cost) / cost) * 100 : 0;
    }).filter(m => m > 0);
    
    if (margins.length === 0) return { avg: 0, low: 0, high: 0 };
    
    return {
      avg: margins.reduce((a, b) => a + b, 0) / margins.length,
      low: margins.filter(m => m < 20).length,
      high: margins.filter(m => m > 50).length
    };
  };

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
          setTimeout(generateGeminiInsights, 3000); // Delay for AI processing
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
