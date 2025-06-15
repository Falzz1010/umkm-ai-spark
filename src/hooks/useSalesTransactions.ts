
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
    
    const { data } = await supabase
      .from("sales_transactions")
      .select("id,created_at,product_id,quantity,price,total,products(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setSales(
      (data || []).map((row) => ({
        ...row,
        product_name: row.products?.name || "-",
        total: row.total ?? row.price * row.quantity,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    
    fetchSales();

    // Real-time subscription untuk sales_transactions
    const salesChannel = supabase
      .channel(`sales_transactions:user:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales_transactions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSales();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(salesChannel);
    };
  }, [user, refreshKey]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus transaksi ini?")) return;
    
    const transaction = sales.find(sale => sale.id === id);
    if (!transaction) return;

    setDeletingId(id);
    
    const { error: deleteError } = await supabase.from("sales_transactions").delete().eq("id", id);
    
    if (!deleteError) {
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
          toast({ title: "Transaksi dihapus!", description: "Data transaksi berhasil dihapus dan stok dikembalikan." });
        } else {
          toast({ title: "Gagal mengembalikan stok", description: stockError.message, variant: "destructive" });
        }
      }
    } else {
      toast({ title: "Gagal menghapus", description: deleteError.message, variant: "destructive" });
    }
    
    setDeletingId(null);
  };

  const handleEditSubmit = async (editing: SaleRow, newValues: { quantity: number; price: number }) => {
    const oldQuantity = editing.quantity;
    const newQuantity = newValues.quantity;
    const quantityDifference = newQuantity - oldQuantity;

    const { error: updateError } = await supabase
      .from("sales_transactions")
      .update({
        quantity: newValues.quantity,
        price: newValues.price,
      })
      .eq("id", editing.id);

    if (!updateError) {
      if (quantityDifference !== 0) {
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
            toast({ title: "Gagal update stok", description: stockError.message, variant: "destructive" });
            return false;
          }
        }
      }

      toast({ title: "Transaksi diperbarui!", description: "Data transaksi berhasil diupdate dengan penyesuaian stok." });
      return true;
    } else {
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
