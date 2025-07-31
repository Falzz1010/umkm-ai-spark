
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SalesTransaction } from "@/types/sales";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

export type SaleRow = SalesTransaction;

export function useSalesTransactions(refreshKey: number) {
  const { user } = useAuth();
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Memoized fetch function
  const fetchSales = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    console.log('Fetching sales transactions for user:', user.id);
    
    try {
      const { data, error } = await supabase
        .from("sales_transactions")
        .select("id,created_at,product_id,quantity,price,total,user_id,products(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching sales:', error);
        return;
      }

      console.log('Sales transactions fetched:', data?.length || 0);
      setSales(
        (data || []).map((row: any) => ({
          ...row,
          product_name: row.products?.name || "-",
          total: row.total ?? row.price * row.quantity,
        }))
      );
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchSales();
    }
  }, [user, refreshKey, fetchSales]);

  // Real-time subscription for sales transactions
  useRealtimeSubscription([
    {
      table: 'sales_transactions',
      event: '*',
      filter: user ? `user_id=eq.${user.id}` : '',
      callback: fetchSales
    }
  ], [user?.id]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus transaksi ini?")) return;
    
    const transaction = sales.find(sale => sale.id === id);
    if (!transaction) return;

    setDeletingId(id);
    console.log('Deleting transaction:', id);
    
    try {
      const { error: deleteError } = await supabase
        .from("sales_transactions")
        .delete()
        .eq("id", id);
      
      if (!deleteError) {
        console.log('Transaction deleted, restoring stock');
        const { data: currentProduct } = await supabase
          .from("products")
          .select("stock")
          .eq("id", transaction.product_id)
          .single();

        if (currentProduct) {
          const newStock = currentProduct.stock + transaction.quantity;
          const { error: stockError } = await supabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", transaction.product_id);

          if (!stockError) {
            console.log('Stock restored successfully');
            toast({ 
              title: "Transaksi dihapus!", 
              description: "Data transaksi berhasil dihapus dan stok dikembalikan." 
            });
          } else {
            console.error('Error restoring stock:', stockError);
            toast({ 
              title: "Gagal mengembalikan stok", 
              description: stockError.message, 
              variant: "destructive" 
            });
          }
        }
      } else {
        console.error('Error deleting transaction:', deleteError);
        toast({ 
          title: "Gagal menghapus", 
          description: deleteError.message, 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error in delete operation:', error);
      toast({ 
        title: "Gagal menghapus", 
        description: "Terjadi kesalahan saat menghapus transaksi", 
        variant: "destructive" 
      });
    } finally {
      setDeletingId(null);
    }
  }, [sales, toast]);

  const handleEditSubmit = useCallback(async (
    editing: SaleRow, 
    newValues: { quantity: number; price: number }
  ) => {
    const oldQuantity = editing.quantity;
    const newQuantity = newValues.quantity;
    const quantityDifference = newQuantity - oldQuantity;

    console.log('Updating transaction:', editing.id, newValues);

    try {
      const { error: updateError } = await supabase
        .from("sales_transactions")
        .update({
          quantity: newValues.quantity,
          price: newValues.price,
        })
        .eq("id", editing.id);

      if (!updateError) {
        if (quantityDifference !== 0) {
          console.log('Adjusting stock by:', quantityDifference);
          const { data: currentProduct } = await supabase
            .from("products")
            .select("stock")
            .eq("id", editing.product_id)
            .single();

          if (currentProduct) {
            const newStock = currentProduct.stock - quantityDifference;
            const { error: stockError } = await supabase
              .from("products")
              .update({ stock: newStock })
              .eq("id", editing.product_id);

            if (stockError) {
              console.error('Error adjusting stock:', stockError);
              toast({ 
                title: "Gagal update stok", 
                description: stockError.message, 
                variant: "destructive" 
              });
              return false;
            }
          }
        }

        console.log('Transaction updated successfully');
        toast({ 
          title: "Transaksi diperbarui!", 
          description: "Data transaksi berhasil diupdate dengan penyesuaian stok." 
        });
        return true;
      } else {
        console.error('Error updating transaction:', updateError);
        toast({ 
          title: "Gagal update", 
          description: updateError.message, 
          variant: "destructive" 
        });
        return false;
      }
    } catch (error) {
      console.error('Error in edit operation:', error);
      toast({ 
        title: "Gagal update", 
        description: "Terjadi kesalahan saat mengupdate transaksi", 
        variant: "destructive" 
      });
      return false;
    }
  }, [toast]);

  return {
    sales,
    loading,
    deletingId,
    handleDelete,
    handleEditSubmit,
  };
}
