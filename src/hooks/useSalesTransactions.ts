
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface SaleRow {
  id: string;
  created_at: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  product_name: string;
}

export function useSalesTransactions(refreshKey: number) {
  const { user } = useAuth();
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch initial data
  const fetchSales = async () => {
    if (!user) return;
    setLoading(true);
    
    console.log('Fetching sales transactions for user:', user.id);
    
    const { data, error } = await supabase
      .from("sales_transactions")
      .select("id,created_at,product_id,quantity,price,total,products(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error('Error fetching sales:', error);
    } else {
      console.log('Sales transactions fetched:', data?.length || 0);
      setSales(
        (data || []).map((row: any) => ({
          ...row,
          product_name: row.products?.name || "-",
          total: row.total ?? row.price * row.quantity,
        }))
      );
    }
    
    setLoading(false);
  };

  // Initial fetch and real-time subscription
  useEffect(() => {
    if (!user) return;
    
    fetchSales();

    console.log('Setting up sales transactions real-time subscription');

    // Real-time subscription untuk sales_transactions
    const salesChannel = supabase
      .channel(`sales-transactions-${user.id}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales_transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time sales transaction change:', payload);
          fetchSales();
        }
      )
      .subscribe((status) => {
        console.log('Sales transactions subscription status:', status);
      });

    return () => {
      console.log('Cleaning up sales transactions subscription');
      supabase.removeChannel(salesChannel);
    };
  }, [user, refreshKey]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus transaksi ini?")) return;
    
    const transaction = sales.find(sale => sale.id === id);
    if (!transaction) return;

    setDeletingId(id);
    console.log('Deleting transaction:', id);
    
    const { error: deleteError } = await supabase.from("sales_transactions").delete().eq("id", id);
    
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
          toast({ title: "Transaksi dihapus!", description: "Data transaksi berhasil dihapus dan stok dikembalikan." });
        } else {
          console.error('Error restoring stock:', stockError);
          toast({ title: "Gagal mengembalikan stok", description: stockError.message, variant: "destructive" });
        }
      }
    } else {
      console.error('Error deleting transaction:', deleteError);
      toast({ title: "Gagal menghapus", description: deleteError.message, variant: "destructive" });
    }
    
    setDeletingId(null);
  };

  const handleEditSubmit = async (editing: SaleRow, newValues: { quantity: number; price: number }) => {
    const oldQuantity = editing.quantity;
    const newQuantity = newValues.quantity;
    const quantityDifference = newQuantity - oldQuantity;

    console.log('Updating transaction:', editing.id, newValues);

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
            toast({ title: "Gagal update stok", description: stockError.message, variant: "destructive" });
            return false;
          }
        }
      }

      console.log('Transaction updated successfully');
      toast({ title: "Transaksi diperbarui!", description: "Data transaksi berhasil diupdate dengan penyesuaian stok." });
      return true;
    } else {
      console.error('Error updating transaction:', updateError);
      toast({ title: "Gagal update", description: updateError.message, variant: "destructive" });
      return false;
    }
  };

  return {
    sales,
    loading,
    deletingId,
    handleDelete,
    handleEditSubmit,
  };
}
