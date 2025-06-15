
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useRealtimeInsights } from '@/hooks/useRealtimeInsights';
import { Product } from '@/types/database';

interface InsightNotificationProps {
  products: Product[];
  maxVisible?: number;
}

export function InsightNotification({ products, maxVisible = 3 }: InsightNotificationProps) {
  const { insights, dismissInsight } = useRealtimeInsights(products);
  const [visibleInsights, setVisibleInsights] = useState<string[]>([]);

  // Show only high priority insights as notifications
  const priorityInsights = insights
    .filter(insight => insight.priority === 'high')
    .slice(0, maxVisible);

  useEffect(() => {
    // Auto-show new high priority insights
    const newInsightIds = priorityInsights
      .filter(insight => !visibleInsights.includes(insight.id))
      .map(insight => insight.id);
    
    if (newInsightIds.length > 0) {
      setVisibleInsights(prev => [...prev, ...newInsightIds]);
    }
  }, [priorityInsights, visibleInsights]);

  const handleDismiss = (insightId: string) => {
    setVisibleInsights(prev => prev.filter(id => id !== insightId));
    dismissInsight(insightId);
  };

  const visibleNotifications = priorityInsights.filter(insight => 
    visibleInsights.includes(insight.id)
  );

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((insight) => (
        <Card key={insight.id} className="shadow-lg border-l-4 border-l-red-500 animate-slide-in-right">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                {insight.type === 'stock_alert' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                {insight.type === 'sales_trend' && <TrendingUp className="h-4 w-4 text-green-600" />}
                {insight.type === 'restock_suggestion' && <Lightbulb className="h-4 w-4 text-orange-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-gray-900">{insight.title}</h4>
                  <Badge variant="destructive" className="text-xs">
                    URGENT
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {insight.message}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {insight.timestamp.toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(insight.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
