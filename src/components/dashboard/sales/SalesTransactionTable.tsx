
import React from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table";
import { SalesTransactionRow } from "./SalesTransactionRow";
import { SaleRow } from "@/hooks/useSalesTransactions";

interface SalesTransactionTableProps {
  sales: SaleRow[];
  deletingId: string | null;
  onEdit: (sale: SaleRow) => void;
  onDelete: (id: string) => void;
}

export function SalesTransactionTable({ sales, deletingId, onEdit, onDelete }: SalesTransactionTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-[80px] sm:w-[100px] text-xs sm:text-sm">Tanggal</TableHead>
            <TableHead className="min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm">Produk</TableHead>
            <TableHead className="w-[60px] sm:w-[80px] text-center text-xs sm:text-sm">Jumlah</TableHead>
            <TableHead className="w-[80px] sm:w-[120px] text-right text-xs sm:text-sm">Harga</TableHead>
            <TableHead className="w-[80px] sm:w-[120px] text-right text-xs sm:text-sm">Total</TableHead>
            <TableHead className="w-[70px] sm:w-[100px] text-center text-xs sm:text-sm">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <SalesTransactionRow
              key={sale.id}
              sale={sale}
              deletingId={deletingId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
