
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Brain, TrendingUp, DollarSign, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Product } from '@/types/database';
import { useGeminiAnalytics } from '@/hooks/useGeminiAnalytics';

interface AIAnalyticsSectionProps {
  products: Product[];
}

export function AIAnalyticsSection({ products }: AIAnalyticsSectionProps) {
  const { 
    productRecommendations, 
    trendPredictions, 
    pricingRecommendations, 
    loading, 
    generateAIAnalytics 
  } = useGeminiAnalytics(products);

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'restock': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'promo': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'optimize': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'discontinue': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Brain className="h-4 w-4 text-gray-600" />;
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[confidence as keyof typeof colors] || colors.medium;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case 'volatile': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Analytics & Insights
            </CardTitle>
            <CardDescription>
              Analisis mendalam powered by Gemini AI untuk optimasi bisnis
            </CardDescription>
          </div>
          <Button 
            onClick={generateAIAnalytics}
            disabled={loading || products.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Generate AI Insights
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations" className="text-sm">
              Rekomendasi Produk
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-sm">
              Prediksi Tren
            </TabsTrigger>
            <TabsTrigger value="pricing" className="text-sm">
              Saran Harga
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="mt-4 space-y-4">
            {productRecommendations.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Belum ada rekomendasi AI. Klik "Generate AI Insights" untuk memulai.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {productRecommendations.map((rec) => (
                  <Card key={rec.id} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-start gap-3">
                      {getRecommendationIcon(rec.recommendation)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {rec.productName}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {rec.reason}
                        </p>
                        <div className="flex gap-2">
                          <Badge className={getConfidenceBadge(rec.confidence)}>
                            {rec.confidence === 'high' ? 'Tinggi' : 
                             rec.confidence === 'medium' ? 'Sedang' : 'Rendah'}
                          </Badge>
                          <Badge variant="outline">
                            Impact: {rec.impact === 'high' ? 'Tinggi' : 
                                   rec.impact === 'medium' ? 'Sedang' : 'Rendah'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends" className="mt-4 space-y-4">
            {trendPredictions.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Belum ada prediksi tren. Generate insights untuk melihat prediksi.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {trendPredictions.map((trend) => (
                  <Card key={trend.id} className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="flex items-start gap-3">
                      {getTrendIcon(trend.trend)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {trend.productName}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {trend.prediction}
                        </p>
                        <div className="flex gap-2">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {trend.confidence}% Confidence
                          </Badge>
                          <Badge variant="outline">
                            {trend.timeframe}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pricing" className="mt-4 space-y-4">
            {pricingRecommendations.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Belum ada rekomendasi harga. Generate insights untuk analisis harga.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pricingRecommendations.map((price) => (
                  <Card key={price.id} className="p-4 bg-gradient-to-r from-green-50 to-yellow-50">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {price.productName}
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <p className="text-xs text-gray-500">Harga Saat Ini</p>
                            <p className="font-semibold">Rp {price.currentPrice.toLocaleString('id-ID')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Harga Disarankan</p>
                            <p className="font-semibold text-green-600">Rp {price.suggestedPrice.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {price.reason}
                        </p>
                        <p className="text-xs text-blue-600 mb-2">
                          {price.expectedIncrease}
                        </p>
                        <Badge className={getConfidenceBadge(price.confidence)}>
                          {price.confidence === 'high' ? 'Tinggi' : 
                           price.confidence === 'medium' ? 'Sedang' : 'Rendah'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
