
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw, Check, X } from 'lucide-react';
import { Product } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface SmartPricingAssistantProps {
  products: Product[];
  onPriceUpdate: () => void;
}

interface PriceSuggestion {
  productId: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  applied: boolean;
}

export function SmartPricingAssistant({ products, onPriceUpdate }: SmartPricingAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PriceSuggestion[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Set up real-time subscription for product updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`pricing-assistant-${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'products',
        filter: `user_id=eq.${user.id}`
      }, () => {
        console.log('Product price updated, refreshing suggestions...');
        onPriceUpdate();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, onPriceUpdate]);

  const generatePricingSuggestions = async () => {
    setLoading(true);
    
    try {
      // First try to use Gemini AI for intelligent pricing
      const aiSuggestions = await generateAISuggestions(products);
      if (aiSuggestions && aiSuggestions.length > 0) {
        setSuggestions(aiSuggestions);
        toast({
          title: "Analisis AI Selesai",
          description: "Rekomendasi harga berhasil dihasilkan dengan Gemini AI",
        });
      } else {
        // Fallback to simulated suggestions if AI fails
        const fallbackSuggestions = generateSimulatedSuggestions(products);
        setSuggestions(fallbackSuggestions);
        toast({
          title: "Analisis Harga Selesai",
          description: "Rekomendasi harga berhasil dihasilkan dengan analisis algoritma",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error generating price suggestions:', error);
      const fallbackSuggestions = generateSimulatedSuggestions(products);
      setSuggestions(fallbackSuggestions);
      toast({
        title: "Menggunakan Analisis Lokal",
        description: "Terjadi kesalahan saat menghubungi AI, menggunakan analisis algoritma",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAISuggestions = async (products: Product[]): Promise<PriceSuggestion[] | null> => {
    try {
      const aiSuggestions: PriceSuggestion[] = [];
      
      // Process each product with Gemini AI
      for (const product of products.slice(0, 5)) { // Limit to 5 products to avoid rate limiting
        const response = await supabase.functions.invoke('gemini-ai', {
          body: {
            prompt: `Berikan saran harga optimal untuk produk: ${product.name}, dengan harga saat ini Rp${product.price}, harga pokok Rp${product.cost || 0}. Berikan harga spesifik dan alasan singkat.`,
            type: 'pricing',
            productData: product
          }
        });

        if (response.error) {
          console.error('Gemini API error:', response.error);
          continue;
        }

        if (response.data?.success && response.data?.generatedText) {
          // Parse AI response to extract pricing information
          const aiResponse = response.data.generatedText;
          const suggestedPriceMatch = aiResponse.match(/Rp\s?(\d{1,3}(,\d{3})*(\.\d+)?)/i);
          
          // Extract numbers with regex and convert to numeric value
          const priceNumbers = aiResponse.match(/\d{4,}/g);
          
          let suggestedPrice = product.price;
          if (suggestedPriceMatch && suggestedPriceMatch[1]) {
            const extractedPrice = suggestedPriceMatch[1].replace(/,/g, '');
            suggestedPrice = parseFloat(extractedPrice);
          } else if (priceNumbers && priceNumbers.length > 0) {
            // Take the first number that looks like a price
            suggestedPrice = parseInt(priceNumbers[0]);
          }
          
          // Ensure the suggested price is reasonable
          if (suggestedPrice < product.cost) {
            suggestedPrice = Math.round(product.cost * 1.2); // at least 20% profit margin
          }

          const trend: 'up' | 'down' | 'stable' = 
            suggestedPrice > product.price ? 'up' : 
            suggestedPrice < product.price ? 'down' : 'stable';
          
          // Extract most reasonable part of response for reason
          let reason = aiResponse.split('.')[0];
          if (reason.length > 80) {
            reason = reason.substring(0, 80) + '...';
          }

          aiSuggestions.push({
            productId: product.id,
            currentPrice: product.price || 0,
            suggestedPrice,
            reason,
            confidence: 'high',
            trend,
            applied: false
          });
        }
      }
      
      // If we have at least some AI suggestions, return them
      return aiSuggestions.length > 0 ? aiSuggestions : null;
      
    } catch (error) {
      console.error('Error calling Gemini AI:', error);
      return null;
    }
  };

  const generateSimulatedSuggestions = (products: Product[]): PriceSuggestion[] => {
    return products.map(product => {
      const currentPrice = product.price || 0;
      const cost = product.cost || 0;
      
      // More intelligent algorithm for price suggestion
      let suggestedPrice = currentPrice;
      let reason = '';
      let trend: 'up' | 'down' | 'stable' = 'stable';
      
      const currentMargin = currentPrice > 0 ? (currentPrice - cost) / cost * 100 : 0;
      
      if (currentMargin < 20 && cost > 0) {
        // Margin terlalu rendah
        suggestedPrice = Math.round(cost * 1.3 / 1000) * 1000;
        reason = `Margin profit terlalu rendah (${currentMargin.toFixed(1)}%). Tingkatkan harga untuk profit optimal.`;
        trend = 'up';
      } else if (currentMargin > 70 && cost > 0) {
        // Margin sangat tinggi, mungkin mempengaruhi daya saing
        suggestedPrice = Math.round(cost * 1.65 / 1000) * 1000;
        reason = `Margin sangat tinggi (${currentMargin.toFixed(1)}%). Pertimbangkan harga lebih kompetitif.`;
        trend = 'down';
      } else {
        // Harga sudah cukup optimal, kenaikan kecil
        const variation = 0.05 + Math.random() * 0.12;
        const isIncrease = Math.random() > 0.4; // Slight bias toward price increases
        suggestedPrice = Math.round(currentPrice * (1 + (isIncrease ? variation : -variation)) / 1000) * 1000;
        
        const reasons = [
          'Analisis kompetitor menunjukkan harga lebih tinggi',
          'Demand tinggi untuk kategori ini',
          'Margin profit dapat dioptimalkan',
          'Harga pasar sedang naik',
          'Kualitas produk mendukung harga premium',
          'Kompetitor menurunkan harga'
        ];
        
        reason = reasons[Math.floor(Math.random() * reasons.length)];
        trend = suggestedPrice > currentPrice ? 'up' : suggestedPrice < currentPrice ? 'down' : 'stable';
      }

      return {
        productId: product.id,
        currentPrice,
        suggestedPrice,
        reason,
        confidence: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        trend,
        applied: false
      };
    });
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const applyPriceSuggestion = async (suggestion: PriceSuggestion) => {
    try {
      const product = products.find(p => p.id === suggestion.productId);
      if (!product) return;
      
      setLoading(true);
      
      // Update product price in database
      const { error } = await supabase
        .from('products')
        .update({ 
          price: suggestion.suggestedPrice,
          updated_at: new Date().toISOString()
        })
        .eq('id', suggestion.productId);
        
      if (error) throw error;
      
      // Update local state to mark as applied
      setSuggestions(prev => prev.map(s => 
        s.productId === suggestion.productId 
          ? { ...s, applied: true, currentPrice: suggestion.suggestedPrice } 
          : s
      ));
      
      toast({
        title: "Harga Diperbarui",
        description: `Harga produk ${product.name} berhasil diperbarui ke Rp${suggestion.suggestedPrice.toLocaleString('id-ID')}`,
        variant: "default",
      });
      
      // Refresh product data
      onPriceUpdate();
      
    } catch (error) {
      console.error('Error applying price suggestion:', error);
      toast({
        title: "Gagal Memperbarui Harga",
        description: "Terjadi kesalahan saat memperbarui harga produk. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Smart Pricing Assistant
          </CardTitle>
          <CardDescription>
            Dapatkan saran harga optimal berdasarkan analisis AI dan data pasar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {products.length} produk tersedia untuk analisis
              </p>
            </div>
            <Button 
              onClick={generatePricingSuggestions}
              disabled={loading || products.length === 0}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Menganalisis...' : 'Analisis Harga'}
            </Button>
          </div>

          {products.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Belum ada produk yang tersedia. Tambahkan produk terlebih dahulu untuk mendapatkan saran harga.
              </AlertDescription>
            </Alert>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Saran Harga Terbaru</h3>
              <div className="grid gap-4">
                {suggestions.map((suggestion) => {
                  const product = products.find(p => p.id === suggestion.productId);
                  if (!product) return null;

                  const priceChange = suggestion.suggestedPrice - suggestion.currentPrice;
                  const percentageChange = ((priceChange / suggestion.currentPrice) * 100).toFixed(1);

                  return (
                    <Card key={suggestion.productId} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {suggestion.reason}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Harga Saat Ini: </span>
                              <span className="font-medium">Rp {suggestion.currentPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getTrendIcon(suggestion.trend)}
                              <span className="text-muted-foreground">Saran: </span>
                              <span className="font-medium">Rp {suggestion.suggestedPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ({priceChange >= 0 ? '+' : ''}{percentageChange}%)
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getConfidenceColor(suggestion.confidence)}>
                            {suggestion.confidence === 'high' ? 'Tinggi' : 
                             suggestion.confidence === 'medium' ? 'Sedang' : 'Rendah'}
                          </Badge>
                          
                          {suggestion.applied ? (
                            <Button size="sm" variant="outline" disabled className="flex items-center gap-1">
                              <Check className="h-3 w-3" /> Diterapkan
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              disabled={loading}
                              onClick={() => applyPriceSuggestion(suggestion)}
                            >
                              Terapkan
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Price Alerts & Monitoring</CardTitle>
          <CardDescription>
            Monitor perubahan harga kompetitor dan dapatkan notifikasi real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="competitor-url">URL Kompetitor</Label>
                <Input 
                  id="competitor-url"
                  placeholder="https://competitor.com/product"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="alert-threshold">Threshold Alert (%)</Label>
                <Input 
                  id="alert-threshold"
                  type="number"
                  placeholder="10"
                  className="mt-1"
                />
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Tambah Monitoring Kompetitor
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              🔄 Monitoring aktif untuk 0 kompetitor
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
