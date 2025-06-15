
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSmartPricing } from '@/hooks/useSmartPricing';
import { Product } from '@/types/database';
import { AlertTriangle, TrendingDown, TrendingUp, DollarSign, X, Trash2 } from 'lucide-react';

interface PriceAlertsProps {
  products: Product[];
}

export function PriceAlerts({ products }: PriceAlertsProps) {
  const { alerts, loading, dismissAlert, clearAllAlerts } = useSmartPricing(products);

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'price_increase': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'price_drop': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'margin_risk': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'competitor_change': return <DollarSign className="h-4 w-4 text-blue-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getAlertTypeLabel = (alertType: string) => {
    switch (alertType) {
      case 'price_increase': return 'Kenaikan Harga';
      case 'price_drop': return 'Penurunan Harga';
      case 'margin_risk': return 'Risiko Margin';
      case 'competitor_change': return 'Perubahan Kompetitor';
      default: return 'Alert';
    }
  };

  if (alerts.length === 0 && !loading) {
    return (
      <Card className="border-orange-200 dark:border-orange-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            Price Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Tidak ada alert harga saat ini. Sistem terus memantau perubahan harga pasar.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:border-orange-600 dark:from-orange-950/20 dark:to-background">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            Price Alerts
            {alerts.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {alerts.length}
              </Badge>
            )}
          </div>
          {alerts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllAlerts}
              className="text-gray-500 hover:text-gray-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800/50 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.alertType)}
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {alert.productName}
                  </h4>
                  <Badge variant={getUrgencyColor(alert.urgency)} className="text-xs">
                    {getAlertTypeLabel(alert.alertType)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {alert.urgency.toUpperCase()}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlert(alert.id)}
                  className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {alert.message}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Harga: Rp{alert.currentPrice.toLocaleString()}
                </span>
                <span>
                  {alert.timestamp.toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
