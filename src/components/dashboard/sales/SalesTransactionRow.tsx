
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SaleRow } from "@/hooks/useSalesTransactions";

interface SalesTransactionRowProps {
  sale: SaleRow;
  deletingId: string | null;
  onEdit: (sale: SaleRow) => void;
  onDelete: (id: string) => void;
}

export function SalesTransactionRow({ sale, deletingId, onEdit, onDelete }: SalesTransactionRowProps) {
  return (
    <TableRow>
      <TableCell>
        {new Date(sale.created_at).toLocaleDateString("id-ID", { 
          day: "2-digit", 
          month: "short", 
          year: "2-digit" 
        })}
      </TableCell>
      <TableCell>{sale.product_name}</TableCell>
      <TableCell>{sale.quantity}</TableCell>
      <TableCell>Rp {Number(sale.price).toLocaleString("id-ID")}</TableCell>
      <TableCell>Rp {Number(sale.total).toLocaleString("id-ID")}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(sale)}
            disabled={deletingId === sale.id}
            aria-label="Edit"
          >
            <Edit className="text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(sale.id)}
            disabled={deletingId === sale.id}
            aria-label="Delete"
          >
            <Trash2 className={deletingId === sale.id ? "text-gray-400" : "text-red-600"} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
