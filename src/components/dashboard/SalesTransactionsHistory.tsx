
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Product } from "@/types/database";

interface SaleRow {
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
