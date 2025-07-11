
import React, { useState } from "react";
import { useSalesTransactions, SaleRow } from "@/hooks/useSalesTransactions";
import { SalesTransactionTable } from "./sales/SalesTransactionTable";
import { EditTransactionDialog } from "./EditTransactionDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SalesTransactionsHistory({ refreshKey }: { refreshKey: number }) {
  const { sales, loading, deletingId, handleDelete, handleEditSubmit } = useSalesTransactions(refreshKey);
  
  const [editing, setEditing] = useState<null | SaleRow>(null);
  const [editOpen, setEditOpen] = useState(false);

  const onEdit = (sale: SaleRow) => {
    setEditing(sale);
    setEditOpen(true);
  };

  const onSave = async (newValues: { quantity: number; price: number }) => {
    if (!editing) return;
    
    const success = await handleEditSubmit(editing, newValues);
    if (success) {
      setEditOpen(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="font-semibold mb-4">Riwayat Penjualan</h3>
      {loading ? (
        <div className="text-sm py-4 text-muted-foreground">Memuat...</div>
      ) : sales.length === 0 ? (
        <div className="text-sm py-4 text-muted-foreground">Belum ada transaksi penjualan.</div>
      ) : (
        <div className="border rounded-lg">
          <ScrollArea className="h-[400px] w-full">
            <SalesTransactionTable
              sales={sales}
              deletingId={deletingId}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          </ScrollArea>
        </div>
      )}
      <EditTransactionDialog
        open={editOpen}
        onOpenChange={(open) => setEditOpen(open)}
        transaction={editing}
        onSave={onSave}
      />
    </div>
  );
}
