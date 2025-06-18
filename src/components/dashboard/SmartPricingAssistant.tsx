
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';
import { Product } from '@/types/database';

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
}

export function SmartPricingAssistant({ products, onPriceUpdate }: SmartPricingAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PriceSuggestion[]>([]);

  const generatePricingSuggestions = () => {
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const newSuggestions: PriceSuggestion[] = products.map(product => {
        const currentPrice = product.price || 0;
        const variation = 0.05 + Math.random() * 0.15; // 5-20% variation
        const isIncrease = Math.random() > 0.5;
        const suggestedPrice = Math.round(currentPrice * (1 + (isIncrease ? variation : -variation)));
        
        const reasons = [
          'Analisis kompetitor menunjukkan harga lebih tinggi',
          'Demand tinggi untuk kategori ini',
          'Margin profit dapat ditingkatkan',
          'Harga pasar sedang naik',
          'Kualitas produk mendukung harga premium',
          'Kompetitor menurunkan harga'
        ];

        return {
          productId: product.id,
          currentPrice,
          suggestedPrice,
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          confidence: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
          trend: suggestedPrice > currentPrice ? 'up' : suggestedPrice < currentPrice ? 'down' : 'stable'
        };
      });

      setSuggestions(newSuggestions);
      setLoading(false);
    }, 2000);
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
                          <Button size="sm" variant="outline">
                            Terapkan
                          </Button>
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
