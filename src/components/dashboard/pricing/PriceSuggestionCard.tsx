
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, Check } from 'lucide-react';
import { Product } from '@/types/database';

interface PriceSuggestion {
  productId: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  applied: boolean;
}

interface PriceSuggestionCardProps {
  suggestion: PriceSuggestion;
  product: Product;
  loading: boolean;
  onApply: (suggestion: PriceSuggestion) => void;
}

export function PriceSuggestionCard({ suggestion, product, loading, onApply }: PriceSuggestionCardProps) {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const priceChange = suggestion.suggestedPrice - suggestion.currentPrice;
  const percentageChange = ((priceChange / suggestion.currentPrice) * 100).toFixed(1);

  return (
    <Card className="p-4 w-full">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
        <div className="flex-1 space-y-3">
          <h4 className="font-medium text-base sm:text-lg">{product.name}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {suggestion.reason}
          </p>
          
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Harga Saat Ini: </span>
                <span className="font-medium">Rp {suggestion.currentPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(suggestion.trend)}
                <span className="text-muted-foreground">Saran: </span>
                <span className="font-medium">Rp {suggestion.suggestedPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ({priceChange >= 0 ? '+' : ''}{percentageChange}%)
            </div>
          </div>
        </div>
        
        <div className="flex flex-row lg:flex-col items-center gap-2 lg:items-end">
          <Badge className={getConfidenceColor(suggestion.confidence)}>
            {suggestion.confidence === 'high' ? 'Tinggi' : 
             suggestion.confidence === 'medium' ? 'Sedang' : 'Rendah'}
          </Badge>
          
          {suggestion.applied ? (
            <Button size="sm" variant="outline" disabled className="flex items-center gap-1 whitespace-nowrap">
              <Check className="h-3 w-3" /> Diterapkan
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              disabled={loading}
              onClick={() => onApply(suggestion)}
              className="whitespace-nowrap"
            >
              {loading ? 'Loading...' : 'Terapkan'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
