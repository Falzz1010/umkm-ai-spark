
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGeminiInsights } from '@/hooks/useGeminiInsights';
import { Product } from '@/types/database';
import { GeminiInsight } from '@/types/gemini';
import { Brain, TrendingUp, Target, BarChart3, Zap, X } from 'lucide-react';

interface GeminiInsightsCardProps {
  products: Product[];
}

export function GeminiInsightsCard({ products }: GeminiInsightsCardProps) {
  const { insights, loading, dismissInsight } = useGeminiInsights(products);

  const getInsightIcon = (type: GeminiInsight['type']) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="h-4 w-4" />;
      case 'strategy': return <Target className="h-4 w-4" />;
      case 'market_trend': return <BarChart3 className="h-4 w-4" />;
      case 'optimization': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: GeminiInsight['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeLabel = (type: GeminiInsight['type']) => {
    switch (type) {
      case 'prediction': return 'Prediksi';
      case 'strategy': return 'Strategi';
      case 'market_trend': return 'Trend Pasar';
      case 'optimization': return 'Optimasi';
      default: return 'Insight';
    }
  };

  if (insights.length === 0 && !loading) {
    return (
      <Card className="dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            AI Business Intelligence
            <Badge variant="outline" className="text-xs border-purple-200 text-purple-700 dark:border-purple-600 dark:text-purple-300">
              Powered by Gemini
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-muted-foreground">
              AI sedang menganalisis data bisnis Anda untuk memberikan insight yang lebih cerdas...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white dark:border-purple-600 dark:from-purple-950/20 dark:to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          AI Business Intelligence
          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-600">
            Powered by Gemini
          </Badge>
          {loading && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-purple-600 dark:text-purple-400">Analyzing...</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="relative p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800/50 dark:border-gray-700 dark:hover:shadow-lg dark:hover:shadow-purple-500/10"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 p-1 rounded-full bg-purple-100 dark:bg-purple-900/40">
                  <div className="text-purple-600 dark:text-purple-400">
                    {getInsightIcon(insight.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {insight.title}
                    </h4>
                    <Badge variant={getPriorityColor(insight.priority)} className="text-xs">
                      {getTypeLabel(insight.type)}
                    </Badge>
                    {insight.confidence && (
                      <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                        {insight.confidence}% confidence
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                    {insight.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {insight.timestamp.toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissInsight(insight.id)}
                      className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
