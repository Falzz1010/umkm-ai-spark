
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

  const priceChange = suggestion.suggestedPrice - suggestion.currentPrice;
  const percentageChange = ((priceChange / suggestion.currentPrice) * 100).toFixed(1);

  return (
    <Card className="p-4">
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
              onClick={() => onApply(suggestion)}
            >
              Terapkan
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
