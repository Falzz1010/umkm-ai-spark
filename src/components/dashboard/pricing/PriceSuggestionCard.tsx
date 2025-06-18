
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
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />;
      case 'down': return <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />;
      default: return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const priceChange = suggestion.suggestedPrice - suggestion.currentPrice;
  const percentageChange = ((priceChange / suggestion.currentPrice) * 100).toFixed(1);

  return (
    <Card className="p-3 sm:p-4 w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0 lg:space-x-4">
        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
          <h4 className="font-medium text-sm sm:text-base lg:text-lg text-gray-800 dark:text-gray-100 line-clamp-2">
            {product.name}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
            {suggestion.reason}
          </p>
          
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                <span className="text-blue-700 dark:text-blue-300 font-medium">Harga Saat Ini:</span>
                <span className="font-semibold text-blue-800 dark:text-blue-200">
                  Rp {suggestion.currentPrice.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                {getTrendIcon(suggestion.trend)}
                <span className="text-green-700 dark:text-green-300 font-medium">Saran:</span>
                <span className="font-semibold text-green-800 dark:text-green-200">
                  Rp {suggestion.suggestedPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold px-2 py-1 rounded-md w-fit ${
              priceChange >= 0 
                ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20' 
                : 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20'
            }`}>
              ({priceChange >= 0 ? '+' : ''}{percentageChange}%)
            </div>
          </div>
        </div>
        
        <div className="flex flex-row sm:flex-row lg:flex-col items-center gap-2 lg:items-end">
          <Badge className={`${getConfidenceColor(suggestion.confidence)} text-xs px-2 py-1 font-medium`}>
            {suggestion.confidence === 'high' ? 'Tinggi' : 
             suggestion.confidence === 'medium' ? 'Sedang' : 'Rendah'}
          </Badge>
          
          {suggestion.applied ? (
            <Button 
              size="sm" 
              variant="outline" 
              disabled 
              className="flex items-center gap-1 whitespace-nowrap text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700"
            >
              <Check className="h-3 w-3" /> Diterapkan
            </Button>
          ) : (
            <Button 
              size="sm" 
              disabled={loading}
              onClick={() => onApply(suggestion)}
              className="whitespace-nowrap text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
            >
              {loading ? 'Loading...' : 'Terapkan'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
