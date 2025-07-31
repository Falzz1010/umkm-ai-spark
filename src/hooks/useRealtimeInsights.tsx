
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';

export interface BusinessInsight {
  id: string;
  type: 'stock_alert' | 'sales_trend' | 'restock_suggestion' | 'pricing_opportunity' | 'performance_alert';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: Date;
  productId?: string;
  productName?: string;
  data?: any;
}

export function useRealtimeInsights(products: Product[]) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const analyzeBusinessData = useCallback(async () => {
    if (!user || products.length === 0) return;

    setLoading(true);
    const newInsights: BusinessInsight[] = [];

    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Get sales data
      const [todaySalesResult, weekSalesResult] = await Promise.all([
        supabase
          .from('sales_transactions')
          .select('product_id, quantity, total, products(name)')
          .eq('user_id', user.id)
          .gte('created_at', todayStart.toISOString()),
        
        supabase
          .from('sales_transactions')
          .select('product_id, quantity, total, created_at')
          .eq('user_id', user.id)
          .gte('created_at', weekAgo.toISOString())
      ]);

      const todaySales = todaySalesResult.data || [];
      const weekSales = weekSalesResult.data || [];

      // 1. Critical Stock Alerts
      products.forEach(product => {
        const stock = product.stock || 0;
        if (stock <= 2 && product.is_active) {
          newInsights.push({
            id: `critical-stock-${product.id}`,
            type: 'stock_alert',
            title: '🚨 Stok Kritis!',
            message: `${product.name} tinggal ${stock} unit. URGENT: Restock sekarang juga!`,
            priority: 'high',
            actionable: true,
            timestamp: new Date(),
            productId: product.id,
            productName: product.name,
            data: { currentStock: stock, criticalLevel: true }
          });
        } else if (stock < 5 && product.is_active) {
          newInsights.push({
            id: `low-stock-${product.id}`,
            type: 'stock_alert',
            title: '⚠️ Stok Menipis',
            message: `${product.name} tinggal ${stock} unit. Siapkan restock dalam 1-2 hari.`,
            priority: 'medium',
            actionable: true,
            timestamp: new Date(),
            productId: product.id,
            productName: product.name,
            data: { currentStock: stock, criticalLevel: false }
          });
        }
      });

      // 2. Sales Performance Analysis
      if (todaySales.length > 0 && weekSales.length > 0) {
        const todayRevenue = todaySales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);
        const dailyAverage = weekSales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0) / 7;
        
        const performanceRatio = dailyAverage > 0 ? todayRevenue / dailyAverage : 0;
        
        if (performanceRatio >= 1.3) {
          newInsights.push({
            id: 'high-performance',
            type: 'sales_trend',
            title: '🚀 Performa Luar Biasa!',
            message: `Penjualan hari ini Rp${todayRevenue.toLocaleString()} (${((performanceRatio - 1) * 100).toFixed(0)}% di atas rata-rata). Pastikan stok produk populer mencukupi!`,
            priority: 'high',
            actionable: true,
            timestamp: new Date(),
            data: { todayRevenue, dailyAverage, performanceRatio }
          });
        } else if (performanceRatio >= 1.15) {
          newInsights.push({
            id: 'good-performance',
            type: 'sales_trend',
            title: '📈 Penjualan Meningkat',
            message: `Penjualan hari ini Rp${todayRevenue.toLocaleString()} (${((performanceRatio - 1) * 100).toFixed(0)}% di atas rata-rata). Tren positif!`,
            priority: 'medium',
            actionable: false,
            timestamp: new Date(),
            data: { todayRevenue, dailyAverage, performanceRatio }
          });
        } else if (performanceRatio <= 0.6) {
          newInsights.push({
            id: 'low-performance',
            type: 'performance_alert',
            title: '📉 Penjualan Rendah',
            message: `Penjualan hari ini Rp${todayRevenue.toLocaleString()} (${((1 - performanceRatio) * 100).toFixed(0)}% di bawah rata-rata). Pertimbangkan promosi atau cek strategi pemasaran.`,
            priority: 'medium',
            actionable: true,
            timestamp: new Date(),
            data: { todayRevenue, dailyAverage, performanceRatio }
          });
        }

        // 3. Hot Product Analysis
        const productSalesMap = todaySales.reduce((acc, sale) => {
          const key = sale.product_id;
          if (!acc[key]) {
            acc[key] = { 
              quantity: 0, 
              revenue: 0, 
              name: (sale.products as any)?.name || 'Unknown Product' 
            };
          }
          acc[key].quantity += sale.quantity;
          acc[key].revenue += Number(sale.total) || 0;
          return acc;
        }, {} as Record<string, { quantity: number; revenue: number; name: string }>);

        Object.entries(productSalesMap).forEach(([productId, salesData]) => {
          const product = products.find(p => p.id === productId);
          if (!product) return;

          const currentStock = product.stock || 0;
          
          // Hot product - high sales today
          if (salesData.quantity >= 3) {
            const stockDaysLeft = currentStock / salesData.quantity;
            
            if (stockDaysLeft <= 1.5) {
              newInsights.push({
                id: `hot-product-${productId}`,
                type: 'restock_suggestion',
                title: '🔥 Produk Laris!',
                message: `${salesData.name} terjual ${salesData.quantity} unit hari ini! Dengan stok ${currentStock}, kemungkinan habis dalam ${stockDaysLeft.toFixed(1)} hari. Restock ASAP!`,
                priority: 'high',
                actionable: true,
                timestamp: new Date(),
                productId,
                productName: salesData.name,
                data: { soldToday: salesData.quantity, stockDaysLeft, revenue: salesData.revenue }
              });
            } else if (stockDaysLeft <= 3) {
              newInsights.push({
                id: `popular-product-${productId}`,
                type: 'restock_suggestion',
                title: '⭐ Produk Populer',
                message: `${salesData.name} terjual ${salesData.quantity} unit hari ini (Rp${salesData.revenue.toLocaleString()}). Persiapkan restock dalam ${Math.ceil(stockDaysLeft)} hari.`,
                priority: 'medium',
                actionable: true,
                timestamp: new Date(),
                productId,
                productName: salesData.name,
                data: { soldToday: salesData.quantity, stockDaysLeft, revenue: salesData.revenue }
              });
            }
          }
        });
      }

      // 4. Pricing Optimization
      products.forEach(product => {
        const cost = Number(product.cost) || 0;
        const price = Number(product.price) || 0;
        
        if (cost > 0 && price > 0) {
          const margin = ((price - cost) / cost) * 100;
          
          if (margin < 15) {
            newInsights.push({
              id: `low-margin-${product.id}`,
              type: 'pricing_opportunity',
              title: '💰 Margin Rendah',
              message: `${product.name} memiliki margin hanya ${margin.toFixed(1)}%. Pertimbangkan menaikkan harga untuk profit optimal.`,
              priority: 'low',
              actionable: true,
              timestamp: new Date(),
              productId: product.id,
              productName: product.name,
              data: { margin, cost, price, suggestedPrice: cost * 1.25 }
            });
          }
        }
      });

      // Sort by priority and limit to most recent
      const sortedInsights = newInsights
        .sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        })
        .slice(0, 8); // Limit to 8 most important insights

      setInsights(sortedInsights);
    } catch (error) {
      console.error('Error analyzing business data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, products]);

  // Real-time subscriptions
  useEffect(() => {
    if (user && products.length > 0) {
      analyzeBusinessData();

      const channel = supabase
        .channel(`insights-${user.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'sales_transactions',
          filter: `user_id=eq.${user.id}`
        }, () => {
          console.log('Sales data changed, refreshing insights...');
          setTimeout(analyzeBusinessData, 2000);
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${user.id}`
        }, () => {
          console.log('Product data changed, refreshing insights...');
          setTimeout(analyzeBusinessData, 1000);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, products.length, analyzeBusinessData]);

  const dismissInsight = useCallback((insightId: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
  }, []);

  return {
    insights,
    loading,
    dismissInsight,
    refreshInsights: analyzeBusinessData
  };
}
