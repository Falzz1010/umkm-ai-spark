
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
  );
}
