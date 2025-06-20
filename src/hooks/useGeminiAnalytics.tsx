
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';

export interface AIProductRecommendation {
  id: string;
  productId: string;
  productName: string;
  recommendation: 'restock' | 'promo' | 'optimize' | 'discontinue';
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
}

export interface AITrendPrediction {
  id: string;
  productId: string;
  productName: string;
  trend: 'rising' | 'declining' | 'stable' | 'volatile';
  prediction: string;
  confidence: number;
  timeframe: '7 days' | '14 days' | '30 days';
}

export interface AIPricingRecommendation {
  id: string;
  productId: string;
  productName: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
  expectedIncrease: string;
  confidence: 'high' | 'medium' | 'low';
}

export function useGeminiAnalytics(products: Product[]) {
  const { user } = useAuth();
  const [productRecommendations, setProductRecommendations] = useState<AIProductRecommendation[]>([]);
  const [trendPredictions, setTrendPredictions] = useState<AITrendPrediction[]>([]);
  const [pricingRecommendations, setPricingRecommendations] = useState<AIPricingRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const generateAIAnalytics = useCallback(async () => {
    if (!user || products.length === 0) return;

    setLoading(true);
    try {
      // Get sales data for context
      const since30Days = new Date();
      since30Days.setDate(since30Days.getDate() - 30);
      
      const { data: salesData } = await supabase
        .from('sales_transactions')
        .select('product_id, quantity, total, created_at')
        .eq('user_id', user.id)
        .gte('created_at', since30Days.toISOString());

      // Process each product with Gemini AI
      const recommendations: AIProductRecommendation[] = [];
      const trends: AITrendPrediction[] = [];
      const pricing: AIPricingRecommendation[] = [];

      for (const product of products.slice(0, 5)) {
        const productSales = salesData?.filter(s => s.product_id === product.id) || [];
        const totalSold = productSales.reduce((sum, s) => sum + s.quantity, 0);
        const revenue = productSales.reduce((sum, s) => sum + Number(s.total), 0);

        try {
          // Product Performance Recommendation
          const perfPrompt = `Analisis performa produk "${product.name}" dengan data:
- Stok: ${product.stock}
- Harga: Rp ${product.price?.toLocaleString('id-ID')}
- Terjual 30 hari: ${totalSold} unit
- Revenue: Rp ${revenue.toLocaleString('id-ID')}
- Kategori: ${product.category}

Berikan rekomendasi dalam format:
REKOMENDASI: [restock/promo/optimize/discontinue]
ALASAN: [penjelasan singkat 1-2 kalimat]
CONFIDENCE: [high/medium/low]
IMPACT: [high/medium/low]`;

          const perfResult = await supabase.functions.invoke('gemini-ai', {
            body: { prompt: perfPrompt, type: 'custom' }
          });

          if (perfResult.data?.success) {
            const response = perfResult.data.generatedText;
            const recommendation = response.match(/REKOMENDASI:\s*(\w+)/i)?.[1] as any || 'optimize';
            const reason = response.match(/ALASAN:\s*([^\n]+)/i)?.[1] || 'Perlu optimasi berdasarkan data penjualan';
            const confidence = response.match(/CONFIDENCE:\s*(\w+)/i)?.[1] as any || 'medium';
            const impact = response.match(/IMPACT:\s*(\w+)/i)?.[1] as any || 'medium';

            recommendations.push({
              id: `rec-${product.id}`,
              productId: product.id,
              productName: product.name,
              recommendation,
              reason,
              confidence,
              impact
            });
          }

          // Trend Prediction
          const trendPrompt = `Prediksi tren penjualan "${product.name}" berdasarkan:
- Penjualan 30 hari: ${totalSold} unit
- Revenue: Rp ${revenue.toLocaleString('id-ID')}
- Stok tersisa: ${product.stock}
- Kategori: ${product.category}

Format response:
TREND: [rising/declining/stable/volatile]
PREDIKSI: [penjelasan trend dan prediksi]
CONFIDENCE: [0-100]
TIMEFRAME: [7 days/14 days/30 days]`;

          const trendResult = await supabase.functions.invoke('gemini-ai', {
            body: { prompt: trendPrompt, type: 'custom' }
          });

          if (trendResult.data?.success) {
            const response = trendResult.data.generatedText;
            const trend = response.match(/TREND:\s*(\w+)/i)?.[1] as any || 'stable';
            const prediction = response.match(/PREDIKSI:\s*([^\n]+)/i)?.[1] || 'Trend stabil berdasarkan data saat ini';
            const confidence = parseInt(response.match(/CONFIDENCE:\s*(\d+)/i)?.[1] || '70');
            const timeframe = response.match(/TIMEFRAME:\s*([^\n]+)/i)?.[1] as any || '30 days';

            trends.push({
              id: `trend-${product.id}`,
              productId: product.id,
              productName: product.name,
              trend,
              prediction,
              confidence,
              timeframe
            });
          }

          // Pricing Recommendation
          const pricePrompt = `Analisis harga optimal untuk "${product.name}":
- Harga saat ini: Rp ${product.price?.toLocaleString('id-ID')}
- Biaya produksi: Rp ${product.cost?.toLocaleString('id-ID')}
- Terjual: ${totalSold} unit/30 hari
- Kategori: ${product.category}

Format response:
HARGA_SARAN: [angka tanpa Rp]
ALASAN: [penjelasan singkat]
PENINGKATAN: [estimasi peningkatan profit/penjualan]
CONFIDENCE: [high/medium/low]`;

          const priceResult = await supabase.functions.invoke('gemini-ai', {
            body: { prompt: pricePrompt, type: 'custom' }
          });

          if (priceResult.data?.success) {
            const response = priceResult.data.generatedText;
            const suggestedPrice = parseInt(response.match(/HARGA_SARAN:\s*(\d+)/i)?.[1] || String(product.price || 0));
            const reason = response.match(/ALASAN:\s*([^\n]+)/i)?.[1] || 'Optimasi harga berdasarkan analisis pasar';
            const expectedIncrease = response.match(/PENINGKATAN:\s*([^\n]+)/i)?.[1] || 'Peningkatan moderat diharapkan';
            const confidence = response.match(/CONFIDENCE:\s*(\w+)/i)?.[1] as any || 'medium';

            pricing.push({
              id: `price-${product.id}`,
              productId: product.id,
              productName: product.name,
              currentPrice: product.price || 0,
              suggestedPrice,
              reason,
              expectedIncrease,
              confidence
            });
          }

        } catch (productError) {
          console.error('Error processing product:', product.name, productError);
        }
      }

      setProductRecommendations(recommendations);
      setTrendPredictions(trends);
      setPricingRecommendations(pricing);

    } catch (error) {
      console.error('Error generating AI analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [user, products]);

  return {
    productRecommendations,
    trendPredictions,
    pricingRecommendations,
    loading,
    generateAIAnalytics
  };
}
