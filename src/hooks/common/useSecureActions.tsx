
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useRoleValidation } from './useRoleValidation';
import { UserRole } from '@/types/database';
import { TableName } from '@/types/supabase';

export function useSecureActions() {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { canAccess } = useRoleValidation();
  const { toast } = useToast();

  const executeAction = async (
    action: () => Promise<any>,
    requiredRoles: UserRole[],
    successMessage?: string,
    errorMessage?: string,
    actionId?: string
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login terlebih dahulu",
        variant: "destructive"
      });
      return { success: false, error: "Tidak ada user yang login" };
    }

    if (!canAccess(requiredRoles)) {
      toast({
        title: "Akses Ditolak",
        description: "Anda tidak memiliki izin untuk melakukan aksi ini",
        variant: "destructive"
      });
      return { success: false, error: "Akses ditolak" };
    }

    try {
      if (actionId) setLoading(actionId);
      
      const result = await action();
      
      if (successMessage) {
        toast({
          title: "Berhasil",
          description: successMessage
        });
      }
      
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Secure action error:', error);
      
      const message = errorMessage || error.message || 'Terjadi kesalahan';
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      
      return { success: false, error: message };
    } finally {
      if (actionId) setLoading(null);
    }
  };

  const deleteItem = async (
    tableName: TableName,
    itemId: string,
    requiredRoles: UserRole[] = ['admin'],
    itemName?: string
  ) => {
    return executeAction(
      async () => {
        const { data, error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', itemId);
        
        if (error) throw error;
        return data;
      },
      requiredRoles,
      `${itemName || 'Item'} berhasil dihapus`,
      `Gagal menghapus ${itemName || 'item'}`,
      `delete-${itemId}`
    );
  };

  const updateItem = async (
    tableName: TableName,
    itemId: string,
    updates: Record<string, any>,
    requiredRoles: UserRole[] = ['user'],
    itemName?: string
  ) => {
    return executeAction(
      async () => {
        const { data, error } = await supabase
          .from(tableName)
          .update(updates)
          .eq('id', itemId);
        
        if (error) throw error;
        return data;
      },
      requiredRoles,
      `${itemName || 'Item'} berhasil diupdate`,
      `Gagal mengupdate ${itemName || 'item'}`,
      `update-${itemId}`
    );
  };

  const createItem = async (
    tableName: TableName,
    data: Record<string, any>,
    requiredRoles: UserRole[] = ['user'],
    itemName?: string
  ) => {
    // Automatically add user_id if not present
    if (!data.user_id && user) {
      data.user_id = user.id;
    }

    return executeAction(
      async () => {
        const { data: result, error } = await supabase
          .from(tableName)
          .insert(data);
        
        if (error) throw error;
        return result;
      },
      requiredRoles,
      `${itemName || 'Item'} berhasil dibuat`,
      `Gagal membuat ${itemName || 'item'}`,
      'create-new'
    );
  };

  return {
    loading,
    executeAction,
    deleteItem,
    updateItem,
    createItem
  };
}
