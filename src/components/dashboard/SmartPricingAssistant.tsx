
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Zap, TrendingUp, BarChart3, AlertTriangle } from 'lucide-react';
import { Product } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PriceSuggestionCard } from './pricing/PriceSuggestionCard';
import { PriceAlertsSection } from './pricing/PriceAlertsSection';

interface PriceSuggestion {
  productId: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  applied: boolean;
}

interface SmartPricingAssistantProps {
  products: Product[];
  onPriceUpdate: () => void;
}

export function SmartPricingAssistant({ products, onPriceUpdate }: SmartPricingAssistantProps) {
  const [suggestions, setSuggestions] = useState<PriceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAISuggestions = async () => {
    if (products.length === 0) {
      toast({
        title: "Tidak ada produk",
        description: "Tambahkan produk terlebih dahulu untuk mendapatkan saran harga AI.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newSuggestions: PriceSuggestion[] = [];

      for (const product of products.slice(0, 5)) {
        try {
          const prompt = `Analisis produk berikut dan berikan saran harga optimal:
            Nama: ${product.name}
            Harga saat ini: Rp ${product.price?.toLocaleString('id-ID') || 0}
            Biaya produksi: Rp ${product.cost?.toLocaleString('id-ID') || 0}
            Kategori: ${product.category || 'Umum'}
            
            Berikan saran harga yang optimal dengan mempertimbangkan:
            1. Margin keuntungan yang sehat (minimal 20-30%)
            2. Daya saing pasar
            3. Posisi produk di kategorinya
            
            Format response: "Saran harga: Rp [jumlah]. Alasan: [penjelasan singkat]"`;

          const { data, error } = await supabase.functions.invoke('gemini-ai', {
            body: { 
              prompt,
              model: 'gemini-1.5-flash'
            }
          });

          if (error) throw error;

          const aiResponse = data.response || '';
          console.log('AI Response for', product.name, ':', aiResponse);

          // Parse AI response
          const suggestedPriceMatch = aiResponse.match(/Rp\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?)/i);
          let suggestedPrice = product.price || 0;
          
          if (suggestedPriceMatch) {
            const extractedPrice = suggestedPriceMatch[1].replace(/[.,]/g, '');
            suggestedPrice = parseInt(extractedPrice) || suggestedPrice;
          }

          // Ensure reasonable price bounds
          const minPrice = (product.cost || 0) * 1.2; // At least 20% margin
          const maxPrice = (product.price || 0) * 2; // Max 2x current price
          
          if (suggestedPrice < minPrice) {
            suggestedPrice = Math.round(minPrice);
          } else if (suggestedPrice > maxPrice) {
            suggestedPrice = Math.round(maxPrice);
          }

          // Extract reason
          let reason = 'Analisis AI menunjukkan optimasi harga diperlukan';
          const reasonMatch = aiResponse.match(/Alasan:\s*(.+?)(?:\.|$)/i);
          if (reasonMatch && reasonMatch[1]) {
            reason = reasonMatch[1].trim();
            if (reason.length > 100) {
              reason = reason.substring(0, 100) + '...';
            }
          }

          // Determine trend and confidence
          const priceChange = suggestedPrice - (product.price || 0);
          const trend: 'up' | 'down' | 'stable' = 
            priceChange > 1000 ? 'up' : 
            priceChange < -1000 ? 'down' : 'stable';

          const confidence: 'high' | 'medium' | 'low' = 
            Math.abs(priceChange) > 5000 ? 'high' :
            Math.abs(priceChange) > 2000 ? 'medium' : 'low';

          newSuggestions.push({
            productId: product.id,
            currentPrice: product.price || 0,
            suggestedPrice,
            reason,
            confidence,
            trend,
            applied: false
          });

        } catch (productError) {
          console.error('Error processing product:', product.name, productError);
          
          // Fallback suggestion
          const fallbackPrice = Math.max(
            (product.cost || 0) * 1.3,
            (product.price || 0) * 1.05
          );
          
          newSuggestions.push({
            productId: product.id,
            currentPrice: product.price || 0,
            suggestedPrice: Math.round(fallbackPrice),
            reason: 'Saran berdasarkan analisis margin optimal',
            confidence: 'medium',
            trend: fallbackPrice > (product.price || 0) ? 'up' : 'stable',
            applied: false
          });
        }
      }

      setSuggestions(newSuggestions);
      toast({
        title: "Saran Harga Diperbarui",
        description: `${newSuggestions.length} saran harga telah dihasilkan dengan AI Gemini.`,
      });

    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      toast({
        title: "Error",
        description: "Gagal menghasilkan saran harga. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = async (suggestion: PriceSuggestion) => {
    setApplyingId(suggestion.productId);
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ price: suggestion.suggestedPrice })
        .eq('id', suggestion.productId);

      if (error) throw error;

      // Update local state
      setSuggestions(prev => 
        prev.map(s => 
          s.productId === suggestion.productId 
            ? { ...s, applied: true }
            : s
        )
      );

      // Refresh parent data
      onPriceUpdate();
      
      toast({
        title: "Harga Diperbarui",
        description: `Harga produk berhasil diperbarui ke Rp ${suggestion.suggestedPrice.toLocaleString('id-ID')}.`,
      });

    } catch (error) {
      console.error('Error applying suggestion:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui harga. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setApplyingId(null);
    }
  };

  // Auto-refresh suggestions when products change
  useEffect(() => {
    if (products.length > 0 && suggestions.length === 0) {
      generateAISuggestions();
    }
  }, [products.length]);

  const suggestionStats = {
    total: suggestions.length,
    highConfidence: suggestions.filter(s => s.confidence === 'high').length,
    priceIncreases: suggestions.filter(s => s.trend === 'up').length,
    applied: suggestions.filter(s => s.applied).length
  };

  return (
    <div className="w-full max-w-none space-y-4 sm:space-y-6">
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
          <TabsTrigger value="suggestions" className="text-xs sm:text-sm">Saran AI</TabsTrigger>
          <TabsTrigger value="monitoring" className="text-xs sm:text-sm">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Saran</p>
                  <p className="text-lg sm:text-xl font-bold">{suggestionStats.total}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Confidence Tinggi</p>
                  <p className="text-lg sm:text-xl font-bold">{suggestionStats.highConfidence}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Naik Harga</p>
                  <p className="text-lg sm:text-xl font-bold">{suggestionStats.priceIncreases}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Diterapkan</p>
                  <p className="text-lg sm:text-xl font-bold">{suggestionStats.applied}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    AI Pricing Suggestions
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Saran harga optimal berdasarkan analisis AI Gemini
                  </CardDescription>
                </div>
                <Button 
                  onClick={generateAISuggestions}
                  disabled={loading || products.length === 0}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Saran AI
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {suggestions.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Belum ada saran harga</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Klik tombol "Generate Saran AI" untuk mendapatkan rekomendasi harga optimal dari AI Gemini.
                  </p>
                  <Button 
                    onClick={generateAISuggestions}
                    disabled={loading || products.length === 0}
                    variant="outline"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Saran Sekarang
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion) => {
                    const product = products.find(p => p.id === suggestion.productId);
                    if (!product) return null;

                    return (
                      <PriceSuggestionCard
                        key={suggestion.productId}
                        suggestion={suggestion}
                        product={product}
                        loading={applyingId === suggestion.productId}
                        onApply={applySuggestion}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <PriceAlertsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
