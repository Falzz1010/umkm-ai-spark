
import React, { useState } from "react";
import { useSalesTransactions, SaleRow } from "@/hooks/useSalesTransactions";
import { SalesTransactionTable } from "./sales/SalesTransactionTable";
import { EditTransactionDialog } from "./EditTransactionDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Riwayat Penjualan</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        {loading ? (
          <div className="text-sm py-4 text-muted-foreground text-center">Memuat...</div>
        ) : sales.length === 0 ? (
          <div className="text-sm py-6 sm:py-8 text-muted-foreground text-center">
            <p>Belum ada transaksi penjualan.</p>
          </div>
        ) : (
          <div className="border rounded-lg w-full overflow-hidden">
            <ScrollArea className="h-[300px] sm:h-[400px] w-full">
              <div className="min-w-full">
                <SalesTransactionTable
                  sales={sales}
                  deletingId={deletingId}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              </div>
            </ScrollArea>
          </div>
        )}
        <EditTransactionDialog
          open={editOpen}
          onOpenChange={(open) => setEditOpen(open)}
          transaction={editing}
          onSave={onSave}
        />
      </CardContent>
    </Card>
  );
}
