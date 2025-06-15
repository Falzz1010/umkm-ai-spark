
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { TableName, DatabaseFilter, OrderByConfig } from '@/types/supabase';

interface UseSecureDataOptions {
  tableName: TableName;
  select?: string;
  orderBy?: OrderByConfig;
  filters?: DatabaseFilter[];
}

export function useSecureData<T>({
  tableName,
  select = '*',
  orderBy,
  filters = []
}: UseSecureDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!user || !userRole) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(tableName).select(select);

      // Apply filters
      filters.forEach(filter => {
        query = query.filter(filter.column, filter.operator, filter.value);
      });

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      const { data: result, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setData((result as T[]) || []);
    } catch (err: any) {
      console.error(`Error fetching ${tableName}:`, err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
      
      // Show toast for permission errors
      if (err.message?.includes('permission') || err.message?.includes('policy')) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki izin untuk mengakses data ini.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user, userRole, tableName, select, JSON.stringify(filters), JSON.stringify(orderBy), toast]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch
  };
}
