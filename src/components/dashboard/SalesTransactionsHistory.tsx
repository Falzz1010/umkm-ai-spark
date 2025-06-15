
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditTransactionDialog } from "./EditTransactionDialog";

export interface SaleRow {
  id: string;
  created_at: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  product_name: string;
}

export function SalesTransactionsHistory({ refreshKey }: { refreshKey: number }) {
  const { user } = useAuth();
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [loading, setLoading] = useState(true);

  // State for edit dialog
  const [editing, setEditing] = useState<null | SaleRow>(null);
  const [editOpen, setEditOpen] = useState(false);

  const { toast } = useToast();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Get sales_transactions join products for display
    supabase
      .from("sales_transactions")
      .select("id,created_at,product_id,quantity,price,total,products(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSales(
          (data || []).map((row) => ({
            ...row,
            product_name: row.products?.name || "-",
            total: row.total ?? row.price * row.quantity,
          }))
        );
        setLoading(false);
      });
  }, [user, refreshKey]);

  // Fungsi hapus transaksi
  async function handleDelete(id: string) {
    if (!window.confirm("Yakin ingin menghapus transaksi ini?")) return;
    const { error } = await supabase.from("sales_transactions").delete().eq("id", id);
    if (!error) {
      setSales((prev) => prev.filter((tx) => tx.id !== id));
      toast({ title: "Transaksi dihapus!", description: "Data transaksi berhasil dihapus." });
    } else {
      toast({ title: "Gagal menghapus", description: error.message, variant: "destructive" });
    }
  }

  // Fungsi edit transaksi
  async function handleEditSubmit(newValues: { quantity: number; price: number }) {
    if (!editing) return;
    const { error } = await supabase
      .from("sales_transactions")
      .update({
        quantity: newValues.quantity,
        price: newValues.price,
      })
      .eq("id", editing.id);
    if (!error) {
      setSales((prev) =>
        prev.map((row) =>
          row.id === editing.id
            ? {
                ...row,
                quantity: newValues.quantity,
                price: newValues.price,
                total: newValues.quantity * newValues.price,
              }
            : row
        )
      );
      toast({ title: "Transaksi diperbarui!", description: "Data transaksi berhasil diupdate." });
      setEditOpen(false);
    } else {
      toast({ title: "Gagal update", description: error.message, variant: "destructive" });
    }
  }

  return (
    <div className="w-full">
      <h3 className="font-semibold mb-2">Riwayat Penjualan</h3>
      {loading ? (
        <div className="text-sm py-4 text-muted-foreground">Memuat...</div>
      ) : sales.length === 0 ? (
        <div className="text-sm py-4 text-muted-foreground">Belum ada transaksi penjualan.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead>Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{new Date(sale.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })}</TableCell>
                <TableCell>{sale.product_name}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>Rp {Number(sale.price).toLocaleString("id-ID")}</TableCell>
                <TableCell>Rp {Number(sale.total).toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(sale);
                        setEditOpen(true);
                      }}
                      aria-label="Edit"
                    >
                      <Edit className="text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(sale.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <EditTransactionDialog
        open={editOpen}
        onOpenChange={(open) => setEditOpen(open)}
        transaction={editing}
        onSave={handleEditSubmit}
      />
    </div>
  );
}
