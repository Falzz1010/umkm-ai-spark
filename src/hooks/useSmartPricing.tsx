import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  alertType: 'price_drop' | 'price_increase' | 'margin_risk' | 'competitor_change';
  currentPrice: number;
  previousPrice: number;
  message: string;
  urgency: 'high' | 'medium' | 'low';
  timestamp: Date;
}

export function useSmartPricing(products: Product[]) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [priceHistory, setPriceHistory] = useState<Record<string, number[]>>({});

  const trackPriceChanges = useCallback(async () => {
    if (!user || products.length === 0) return;

    const newHistory = { ...priceHistory };
    const newAlerts: PriceAlert[] = [];

    products.forEach(product => {
      const currentPrice = Number(product.price) || 0;
      const productHistory = newHistory[product.id] || [];
      
      // Keep last 10 price points
      if (productHistory.length === 0 || productHistory[productHistory.length - 1] !== currentPrice) {
        productHistory.push(currentPrice);
        if (productHistory.length > 10) {
          productHistory.shift();
        }
        newHistory[product.id] = productHistory;

        // Generate alerts for significant price changes
        if (productHistory.length >= 2) {
          const previousPrice = productHistory[productHistory.length - 2];
          const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
          
          if (Math.abs(priceChange) >= 10) {
            newAlerts.push({
              id: `alert-${product.id}-${Date.now()}`,
              productId: product.id,
              productName: product.name,
              alertType: priceChange > 0 ? 'price_increase' : 'price_drop',
              currentPrice,
              previousPrice,
              message: `Harga ${priceChange > 0 ? 'naik' : 'turun'} ${Math.abs(priceChange).toFixed(1)}%`,
              urgency: Math.abs(priceChange) >= 20 ? 'high' : 'medium',
              timestamp: new Date()
            });
          }
        }

        // Check margin risk
        const cost = Number(product.cost) || 0;
        if (cost > 0) {
          const margin = ((currentPrice - cost) / cost) * 100;
          if (margin < 15) {
            newAlerts.push({
              id: `margin-${product.id}-${Date.now()}`,
              productId: product.id,
              productName: product.name,
              alertType: 'margin_risk',
              currentPrice,
              previousPrice: currentPrice,
              message: `Margin rendah: ${margin.toFixed(1)}% - risiko kerugian`,
              urgency: margin < 5 ? 'high' : 'medium',
              timestamp: new Date()
            });
          }
        }
      }
    });

    setPriceHistory(newHistory);
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 20)); // Keep only recent 20 alerts
    }
  }, [user, products, priceHistory]);

  const simulateMarketMonitoring = useCallback(async () => {
    if (!user || products.length === 0) return;

    setLoading(true);
    try {
      // Simulate competitor price monitoring
      const competitorAlerts: PriceAlert[] = [];
      
      products.forEach(product => {
        if (Math.random() < 0.3) { // 30% chance of competitor change
          const currentPrice = Number(product.price) || 0;
          const competitorPrice = currentPrice * (0.8 + Math.random() * 0.4);
          const priceDiff = ((currentPrice - competitorPrice) / competitorPrice) * 100;
          
          if (Math.abs(priceDiff) > 15) {
            competitorAlerts.push({
              id: `competitor-${product.id}-${Date.now()}`,
              productId: product.id,
              productName: product.name,
              alertType: 'competitor_change',
              currentPrice,
              previousPrice: competitorPrice,
              message: `Kompetitor ${priceDiff > 0 ? 'lebih murah' : 'lebih mahal'} ${Math.abs(priceDiff).toFixed(1)}%`,
              urgency: Math.abs(priceDiff) > 25 ? 'high' : 'medium',
              timestamp: new Date()
            });
          }
        }
      });

      if (competitorAlerts.length > 0) {
        setAlerts(prev => [...competitorAlerts, ...prev].slice(0, 20));
        
        const highUrgencyAlerts = competitorAlerts.filter(alert => alert.urgency === 'high');
        if (highUrgencyAlerts.length > 0) {
          toast({
            title: "Alert Harga Kompetitor!",
            description: `${highUrgencyAlerts.length} produk memerlukan perhatian`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error monitoring market:', error);
    } finally {
      setLoading(false);
    }
  }, [user, products, toast]);

  // Monitor price changes
  useEffect(() => {
    trackPriceChanges();
  }, [trackPriceChanges]);

  // Simulate periodic market monitoring
  useEffect(() => {
    if (user && products.length > 0) {
      const interval = setInterval(simulateMarketMonitoring, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [user, products.length, simulateMarketMonitoring]);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    loading,
    dismissAlert,
    clearAllAlerts,
    refreshMonitoring: simulateMarketMonitoring
  };
}
