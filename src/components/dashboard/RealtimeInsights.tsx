
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, ShoppingCart, DollarSign } from 'lucide-react';

interface BusinessInsight {
  id: string;
  type: 'stock_alert' | 'sales_trend' | 'restock_suggestion' | 'pricing_opportunity';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: Date;
  productId?: string;
  productName?: string;
  data?: any;
}

interface RealtimeInsightsProps {
  products: Product[];
}

export function RealtimeInsights({ products }: RealtimeInsightsProps) {
  const { user } = useAuth();
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate insights based on current data
  const generateInsights = useCallback(async () => {
    if (!user || products.length === 0) return;

    setLoading(true);
    const newInsights: BusinessInsight[] = [];

    try {
      // Get sales data for analysis
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      const { data: todaySales } = await supabase
        .from('sales_transactions')
        .select('product_id, quantity, total, products(name)')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString().split('T')[0]);

      const { data: weekSales } = await supabase
        .from('sales_transactions')
        .select('product_id, quantity, total, created_at')
        .eq('user_id', user.id)
        .gte('created_at', lastWeek.toISOString());

      // 1. Stock Alerts
      products.forEach(product => {
        if ((product.stock || 0) < 5 && product.is_active) {
          newInsights.push({
            id: `stock-${product.id}`,
            type: 'stock_alert',
            title: 'Stok Hampir Habis!',
            message: `${product.name} tinggal ${product.stock} unit. Segera restock untuk menghindari kehabisan.`,
            priority: 'high',
            actionable: true,
            timestamp: new Date(),
            productId: product.id,
            productName: product.name,
            data: { currentStock: product.stock }
          });
        }
      });

      // 2. Sales Trend Analysis
      if (todaySales && weekSales) {
        const todayTotal = todaySales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);
        const weeklyAvg = weekSales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0) / 7;
        
        if (todayTotal > weeklyAvg * 1.2) {
          newInsights.push({
            id: 'sales-trend-up',
            type: 'sales_trend',
            title: 'Penjualan Meningkat Signifikan!',
            message: `Penjualan hari ini Rp${todayTotal.toLocaleString()} (${((todayTotal/weeklyAvg - 1) * 100).toFixed(0)}% lebih tinggi dari rata-rata). Pertimbangkan restok produk populer.`,
            priority: 'medium',
            actionable: true,
            timestamp: new Date(),
            data: { todayTotal, weeklyAvg, increase: ((todayTotal/weeklyAvg - 1) * 100).toFixed(0) }
          });
        } else if (todayTotal < weeklyAvg * 0.7) {
          newInsights.push({
            id: 'sales-trend-down',
            type: 'sales_trend',
            title: 'Penjualan Menurun',
            message: `Penjualan hari ini Rp${todayTotal.toLocaleString()} (${((1 - todayTotal/weeklyAvg) * 100).toFixed(0)}% lebih rendah dari rata-rata). Pertimbangkan strategi promosi.`,
            priority: 'medium',
            actionable: true,
            timestamp: new Date(),
            data: { todayTotal, weeklyAvg, decrease: ((1 - todayTotal/weeklyAvg) * 100).toFixed(0) }
          });
        }

        // 3. Product-specific insights
        const productSales = todaySales.reduce((acc, sale) => {
          if (!acc[sale.product_id]) acc[sale.product_id] = { quantity: 0, name: sale.products?.name };
          acc[sale.product_id].quantity += sale.quantity;
          return acc;
        }, {} as Record<string, { quantity: number; name: string }>);

        Object.entries(productSales).forEach(([productId, data]) => {
          const product = products.find(p => p.id === productId);
          if (product && data.quantity >= 5) {
            newInsights.push({
              id: `restock-${productId}`,
              type: 'restock_suggestion',
              title: 'Produk Laris Manis!',
              message: `${data.name} terjual ${data.quantity} unit hari ini. Pastikan stok mencukupi untuk besok.`,
              priority: 'medium',
              actionable: true,
              timestamp: new Date(),
              productId,
              productName: data.name,
              data: { soldToday: data.quantity, currentStock: product.stock }
            });
          }
        });
      }

      // 4. Pricing Opportunities
      products.forEach(product => {
        const cost = Number(product.cost) || 0;
        const price = Number(product.price) || 0;
        const margin = cost > 0 ? ((price - cost) / cost) * 100 : 0;

        if (margin < 20 && margin > 0) {
          newInsights.push({
            id: `pricing-${product.id}`,
            type: 'pricing_opportunity',
            title: 'Peluang Optimasi Harga',
            message: `${product.name} memiliki margin rendah (${margin.toFixed(0)}%). Pertimbangkan menaikkan harga untuk meningkatkan profit.`,
            priority: 'low',
            actionable: true,
            timestamp: new Date(),
            productId: product.id,
            productName: product.name,
            data: { currentMargin: margin, cost, price }
          });
        }
      });

      setInsights(newInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  }, [user, products]);

  // Real-time updates
  useEffect(() => {
    if (user) {
      generateInsights();

      // Listen for real-time changes
      const channel = supabase
        .channel('business-insights')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'sales_transactions',
          filter: `user_id=eq.${user.id}`
        }, () => {
          setTimeout(generateInsights, 1000); // Delay to ensure data is updated
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${user.id}`
        }, () => {
          setTimeout(generateInsights, 1000);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, products, generateInsights]);

  const getInsightIcon = (type: BusinessInsight['type']) => {
    switch (type) {
      case 'stock_alert': return <AlertTriangle className="h-4 w-4" />;
      case 'sales_trend': return <TrendingUp className="h-4 w-4" />;
      case 'restock_suggestion': return <ShoppingCart className="h-4 w-4" />;
      case 'pricing_opportunity': return <DollarSign className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: BusinessInsight['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const dismissInsight = (insightId: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
  };

  if (insights.length === 0 && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Business Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Tidak ada insight khusus saat ini. AI akan memberikan saran saat ada perubahan data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Business Insights
          {loading && <span className="text-sm text-muted-foreground">(Menganalisis...)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-3 rounded-lg border ${getPriorityColor(insight.priority)} relative`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {insight.timestamp.toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissInsight(insight.id)}
                      className="h-6 text-xs"
                    >
                      Tutup
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
