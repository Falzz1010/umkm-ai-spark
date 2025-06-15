
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/database';
import { TrendingUp, TrendingDown, AlertTriangle, Target, RefreshCw, DollarSign } from 'lucide-react';

interface PricingInsight {
  id: string;
  productId: string;
  productName: string;
  currentPrice: number;
  suggestedPrice: number;
  marketAverage: number;
  competitorPrices: { name: string; price: number }[];
  priceChange: 'increase' | 'decrease' | 'maintain';
  confidence: number;
  reason: string;
  urgency: 'high' | 'medium' | 'low';
  timestamp: Date;
}

interface SmartPricingAssistantProps {
  products: Product[];
  onPriceUpdate: (productId: string, newPrice: number) => void;
}

export function SmartPricingAssistant({ products, onPriceUpdate }: SmartPricingAssistantProps) {
  const { toast } = useToast();
  const [insights, setInsights] = useState<PricingInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const analyzePricing = async () => {
    setLoading(true);
    try {
      // Simulate market price analysis
      const newInsights: PricingInsight[] = products.map(product => {
        const currentPrice = Number(product.price) || 0;
        const cost = Number(product.cost) || 0;
        
        // Simulate competitor prices (in real app, this would come from external APIs)
        const competitorPrices = [
          { name: 'Toko A', price: currentPrice * (0.9 + Math.random() * 0.2) },
          { name: 'Toko B', price: currentPrice * (0.95 + Math.random() * 0.1) },
          { name: 'Marketplace', price: currentPrice * (0.85 + Math.random() * 0.3) }
        ];
        
        const marketAverage = competitorPrices.reduce((sum, comp) => sum + comp.price, 0) / competitorPrices.length;
        const margin = cost > 0 ? ((currentPrice - cost) / cost) * 100 : 0;
        
        let suggestedPrice = currentPrice;
        let priceChange: PricingInsight['priceChange'] = 'maintain';
        let reason = 'Harga sudah optimal';
        let urgency: PricingInsight['urgency'] = 'low';
        let confidence = 85;
        
        // Pricing logic
        if (currentPrice > marketAverage * 1.15) {
          suggestedPrice = Math.round(marketAverage * 1.05 / 1000) * 1000;
          priceChange = 'decrease';
          reason = `Harga Anda ${((currentPrice / marketAverage - 1) * 100).toFixed(1)}% di atas rata-rata pasar`;
          urgency = 'high';
          confidence = 92;
        } else if (currentPrice < marketAverage * 0.85 && margin > 30) {
          suggestedPrice = Math.round(marketAverage * 0.95 / 1000) * 1000;
          priceChange = 'increase';
          reason = `Peluang menaikkan harga dengan margin tinggi (${margin.toFixed(1)}%)`;
          urgency = 'medium';
          confidence = 88;
        } else if (margin < 15) {
          suggestedPrice = Math.round(cost * 1.25 / 1000) * 1000;
          priceChange = 'increase';
          reason = `Margin terlalu rendah (${margin.toFixed(1)}%), risiko kerugian`;
          urgency = 'high';
          confidence = 95;
        }
        
        return {
          id: `pricing-${product.id}`,
          productId: product.id,
          productName: product.name,
          currentPrice,
          suggestedPrice,
          marketAverage,
          competitorPrices,
          priceChange,
          confidence,
          reason,
          urgency,
          timestamp: new Date()
        };
      }).filter(insight => insight.priceChange !== 'maintain');
      
      setInsights(newInsights);
      
      if (newInsights.length > 0) {
        toast({
          title: "Analisis Harga Selesai",
          description: `Ditemukan ${newInsights.length} rekomendasi harga baru`,
        });
      }
    } catch (error) {
      console.error('Error analyzing pricing:', error);
      toast({
        title: "Error",
        description: "Gagal menganalisis harga pasar",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyPriceSuggestion = (insight: PricingInsight) => {
    onPriceUpdate(insight.productId, insight.suggestedPrice);
    setInsights(prev => prev.filter(i => i.id !== insight.id));
    
    toast({
      title: "Harga Diperbarui",
      description: `${insight.productName} - Rp${insight.suggestedPrice.toLocaleString()}`,
    });
  };

  const dismissInsight = (insightId: string) => {
    setInsights(prev => prev.filter(i => i.id !== insightId));
  };

  const getUrgencyColor = (urgency: PricingInsight['urgency']) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
    }
  };

  const getPriceChangeIcon = (change: PricingInsight['priceChange']) => {
    switch (change) {
      case 'increase': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      analyzePricing();
    }
  }, [products.length]);

  const filteredInsights = insights.filter(insight =>
    insight.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:border-blue-600 dark:from-blue-950/20 dark:to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Smart Pricing Assistant
          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={analyzePricing} 
            disabled={loading}
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Menganalisis...' : 'Refresh'}
          </Button>
        </div>

        {insights.length === 0 && !loading ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Tidak ada rekomendasi harga saat ini. Harga produk Anda sudah optimal.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {filteredInsights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800/50 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getPriceChangeIcon(insight.priceChange)}
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {insight.productName}
                    </h4>
                    <Badge variant={getUrgencyColor(insight.urgency)} className="text-xs">
                      {insight.urgency.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissInsight(insight.id)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Harga Saat Ini:</span>
                    <p className="font-semibold">Rp{insight.currentPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Harga Disarankan:</span>
                    <p className={`font-semibold ${
                      insight.priceChange === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Rp{insight.suggestedPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Rata-rata Pasar:</span>
                    <p className="font-semibold">Rp{insight.marketAverage.toLocaleString()}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {insight.reason}
                </p>

                <div className="mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Harga Kompetitor:</span>
                  <div className="flex gap-2 flex-wrap">
                    {insight.competitorPrices.map((comp, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {comp.name}: Rp{comp.price.toLocaleString()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {insight.timestamp.toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => applyPriceSuggestion(insight)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Terapkan Harga
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
