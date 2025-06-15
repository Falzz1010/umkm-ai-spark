
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DailySalesData } from "@/types/sales";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

export function useChartData() {
  const { user } = useAuth();
  const [data, setData] = useState<DailySalesData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    console.log('Fetching sales chart data for user:', user.id);
    
    try {
      const { data: salesData, error } = await supabase
        .from("daily_sales_summary")
        .select("sale_date,total_omzet,total_laba")
        .eq("user_id", user.id)
        .order("sale_date", { ascending: true });
      
      if (error) {
        console.error('Error fetching chart data:', error);
        return;
      }

      console.log('Chart data fetched:', salesData?.length || 0, 'records');
      setData(
        (salesData || []).map((row) => ({
          sale_date: row.sale_date,
          total_omzet: Number(row.total_omzet || 0),
          total_laba: Number(row.total_laba || 0),
        }))
      );
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  useRealtimeSubscription([
    {
      table: 'sales_transactions',
      event: '*',
      filter: user ? `user_id=eq.${user.id}` : '',
      callback: () => {
        setTimeout(() => {
          fetchData();
        }, 500);
      }
    }
  ], [user?.id]);

  return { data, loading };
}
