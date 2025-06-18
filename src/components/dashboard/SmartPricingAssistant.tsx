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
    <div className="w-full max-w-none space-y-3 sm:space-y-4 lg:space-y-6 px-2 sm:px-0">
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4 lg:mb-6 h-10 sm:h-12 bg-blue-50 dark:bg-gray-800">
          <TabsTrigger 
            value="suggestions" 
            className="text-xs sm:text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500"
          >
            Saran AI
          </TabsTrigger>
          <TabsTrigger 
            value="monitoring" 
            className="text-xs sm:text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500"
          >
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            <Card className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-300 truncate">Total Saran</p>
                  <p className="text-sm sm:text-lg lg:text-xl font-bold text-blue-800 dark:text-blue-200">{suggestionStats.total}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-300 truncate">High Confidence</p>
                  <p className="text-sm sm:text-lg lg:text-xl font-bold text-green-800 dark:text-green-200">{suggestionStats.highConfidence}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-orange-700 dark:text-orange-300 truncate">Naik Harga</p>
                  <p className="text-sm sm:text-lg lg:text-xl font-bold text-orange-800 dark:text-orange-200">{suggestionStats.priceIncreases}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-purple-700 dark:text-purple-300 truncate">Diterapkan</p>
                  <p className="text-sm sm:text-lg lg:text-xl font-bold text-purple-800 dark:text-purple-200">{suggestionStats.applied}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1 sm:space-y-2">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl text-gray-800 dark:text-gray-100">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                    AI Pricing Suggestions
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Saran harga optimal berdasarkan analisis AI Gemini
                  </CardDescription>
                </div>
                <Button 
                  onClick={generateAISuggestions}
                  disabled={loading || products.length === 0}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 text-xs sm:text-sm px-3 sm:px-4 py-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Generate Saran AI
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {suggestions.length === 0 ? (
                <div className="text-center py-6 sm:py-8 lg:py-12">
                  <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Belum ada saran harga</h3>
                  <p className="text-muted-foreground mb-3 sm:mb-4 max-w-md mx-auto text-xs sm:text-sm text-gray-600 dark:text-gray-300 px-4">
                    Klik tombol "Generate Saran AI" untuk mendapatkan rekomendasi harga optimal dari AI Gemini.
                  </p>
                  <Button 
                    onClick={generateAISuggestions}
                    disabled={loading || products.length === 0}
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 text-xs sm:text-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Generate Saran Sekarang
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
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
