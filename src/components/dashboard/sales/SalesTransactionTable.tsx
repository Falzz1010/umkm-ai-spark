
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
    <div className="w-full">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-[100px]">Tanggal</TableHead>
            <TableHead className="min-w-[120px]">Produk</TableHead>
            <TableHead className="w-[80px] text-center">Jumlah</TableHead>
            <TableHead className="w-[120px] text-right">Harga Jual</TableHead>
            <TableHead className="w-[120px] text-right">Total</TableHead>
            <TableHead className="w-[100px] text-center">Aksi</TableHead>
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
