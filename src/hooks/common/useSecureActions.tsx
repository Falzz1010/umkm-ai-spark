
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSweetAlert } from '@/hooks/useSweetAlert';
import { useRoleValidation } from './useRoleValidation';
import { UserRole } from '@/types/database';
import { TableName, TableInsert } from '@/types/supabase';

interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface SecureActionOptions {
  successMessage?: string;
  errorMessage?: string;
  actionId?: string;
  useSweet?: boolean;
  showLoading?: boolean;
}

export function useSecureActions() {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { canAccess } = useRoleValidation();
  const { toast } = useToast();
  const { showSuccess, showError, showLoading, closeLoading } = useSweetAlert();

  const executeAction = async (
    action: () => Promise<any>,
    requiredRoles: UserRole[],
    options: SecureActionOptions = {}
  ): Promise<ActionResult> => {
    const { successMessage, errorMessage, actionId, useSweet = false, showLoading: showLoadingAlert = false } = options;

    if (!user) {
      const message = "Anda harus login terlebih dahulu";
      if (useSweet) {
        showError("Error", message);
      } else {
        toast({
          title: "Error",
          description: message,
          variant: "destructive"
        });
      }
      return { success: false, error: "Tidak ada user yang login" };
    }

    if (!canAccess(requiredRoles)) {
      const message = "Anda tidak memiliki izin untuk melakukan aksi ini";
      if (useSweet) {
        showError("Akses Ditolak", message);
      } else {
        toast({
          title: "Akses Ditolak",
          description: message,
          variant: "destructive"
        });
      }
      return { success: false, error: "Akses ditolak" };
    }

    try {
      if (actionId) setLoading(actionId);
      if (showLoadingAlert) showLoading("Sedang memproses...");
      
      const result = await action();
      
      if (showLoadingAlert) closeLoading();
      
      if (successMessage) {
        if (useSweet) {
          showSuccess("Berhasil", successMessage);
        } else {
          toast({
            title: "Berhasil",
            description: successMessage
          });
        }
      }
      
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Secure action error:', error);
      
      if (showLoadingAlert) closeLoading();
      
      const message = errorMessage || error.message || 'Terjadi kesalahan';
      if (useSweet) {
        showError("Error", message);
      } else {
        toast({
          title: "Error",
          description: message,
          variant: "destructive"
        });
      }
      
      return { success: false, error: message };
    } finally {
      if (actionId) setLoading(null);
    }
  };

  const deleteItem = async (
    tableName: TableName,
    itemId: string,
    requiredRoles: UserRole[] = ['admin'],
    itemName?: string,
    useSweet: boolean = false
  ): Promise<ActionResult> => {
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
      {
        successMessage: `${itemName || 'Item'} berhasil dihapus`,
        errorMessage: `Gagal menghapus ${itemName || 'item'}`,
        actionId: `delete-${itemId}`,
        useSweet,
        showLoading: useSweet
      }
    );
  };

  const updateItem = async (
    tableName: TableName,
    itemId: string,
    updates: Record<string, any>,
    requiredRoles: UserRole[] = ['user'],
    itemName?: string,
    useSweet: boolean = false
  ): Promise<ActionResult> => {
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
      {
        successMessage: `${itemName || 'Item'} berhasil diupdate`,
        errorMessage: `Gagal mengupdate ${itemName || 'item'}`,
        actionId: `update-${itemId}`,
        useSweet,
        showLoading: useSweet
      }
    );
  };

  const createItem = async <T extends TableName>(
    tableName: T,
    data: TableInsert<T>,
    requiredRoles: UserRole[] = ['user'],
    itemName?: string,
    useSweet: boolean = false
  ): Promise<ActionResult> => {
    // Automatically add user_id if not present and user exists
    const insertData = { ...data } as any;
    if (!insertData.user_id && user && tableName !== 'profiles') {
      insertData.user_id = user.id;
    }

    return executeAction(
      async () => {
        const { data: result, error } = await supabase
          .from(tableName)
          .insert(insertData as any);
        
        if (error) throw error;
        return result;
      },
      requiredRoles,
      {
        successMessage: `${itemName || 'Item'} berhasil dibuat`,
        errorMessage: `Gagal membuat ${itemName || 'item'}`,
        actionId: 'create-new',
        useSweet,
        showLoading: useSweet
      }
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
