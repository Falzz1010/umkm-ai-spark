
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Product } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { PriceSuggestionCard } from './pricing/PriceSuggestionCard';
import { PriceAlertsSection } from './pricing/PriceAlertsSection';
import { PriceSuggestion, generateSimulatedSuggestions, parseAIPriceResponse, extractReasonFromAI } from '@/utils/pricingUtils';

interface SmartPricingAssistantProps {
  products: Product[];
  onPriceUpdate: () => void;
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
          const aiResponse = response.data.generatedText;
          const suggestedPrice = parseAIPriceResponse(aiResponse, product);
          
          const trend: 'up' | 'down' | 'stable' = 
            suggestedPrice > product.price ? 'up' : 
            suggestedPrice < product.price ? 'down' : 'stable';
          
          const reason = extractReasonFromAI(aiResponse);

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
      
      return aiSuggestions.length > 0 ? aiSuggestions : null;
      
    } catch (error) {
      console.error('Error calling Gemini AI:', error);
      return null;
    }
  };

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

                  return (
                    <PriceSuggestionCard
                      key={suggestion.productId}
                      suggestion={suggestion}
                      product={product}
                      loading={loading}
                      onApply={applyPriceSuggestion}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <PriceAlertsSection />
    </div>
  );
}
