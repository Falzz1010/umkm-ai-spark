
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

interface RealSalesData {
  totalOmzet: number;
  totalLaba: number;
  loading: boolean;
}

export function useRealSalesData(): RealSalesData {
  const { user } = useAuth();
  const [totalOmzet, setTotalOmzet] = useState(0);
  const [totalLaba, setTotalLaba] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRealSalesData = useCallback(async () => {
    if (!user) return;

    try {
      console.log('Fetching real sales data for user:', user.id);
      
      // Query untuk mendapatkan total omzet dari sales_transactions
      const { data: salesData, error: salesError } = await supabase
        .from('sales_transactions')
        .select(`
          total,
          quantity,
          price,
          products!inner(cost, price as product_price)
        `)
        .eq('user_id', user.id);

      if (salesError) {
        console.error('Error fetching sales data:', salesError);
        return;
      }

      // Hitung total omzet dan laba dari sales aktual
      let calculatedOmzet = 0;
      let calculatedLaba = 0;

      salesData?.forEach((sale: any) => {
        // Total omzet dari penjualan aktual
        calculatedOmzet += Number(sale.total) || 0;
        
        // Hitung laba: (harga jual - cost) × quantity
        const salePrice = Number(sale.price) || 0;
        const productCost = Number(sale.products?.cost) || 0;
        const quantity = Number(sale.quantity) || 0;
        
        calculatedLaba += (salePrice - productCost) * quantity;
      });

      console.log('Real sales data calculated:', { 
        totalOmzet: calculatedOmzet, 
        totalLaba: calculatedLaba,
        salesCount: salesData?.length || 0
      });

      setTotalOmzet(calculatedOmzet);
      setTotalLaba(calculatedLaba);
    } catch (error) {
      console.error('Error in fetchRealSalesData:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Setup real-time subscription for sales_transactions
  const subscriptionConfigs = user ? [
    {
      table: 'sales_transactions',
      event: '*' as const,
      filter: `user_id=eq.${user.id}`,
      callback: () => {
        console.log('Real-time sales data update detected');
        fetchRealSalesData();
      }
    }
  ] : [];

  useRealtimeSubscription(subscriptionConfigs, [user?.id]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchRealSalesData();
    }
  }, [user, fetchRealSalesData]);

  return {
    totalOmzet,
    totalLaba,
    loading
  };
}
