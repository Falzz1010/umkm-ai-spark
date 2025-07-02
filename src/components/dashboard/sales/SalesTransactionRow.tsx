
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
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">
        {new Date(sale.created_at).toLocaleDateString("id-ID", { 
          day: "2-digit", 
          month: "short", 
          year: "2-digit" 
        })}
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <span title={sale.product_name}>{sale.product_name}</span>
      </TableCell>
      <TableCell className="text-center font-medium">{sale.quantity}</TableCell>
      <TableCell className="text-right font-medium">
        Rp {Number(sale.price).toLocaleString("id-ID")}
      </TableCell>
      <TableCell className="text-right font-semibold">
        Rp {Number(sale.total).toLocaleString("id-ID")}
      </TableCell>
      <TableCell>
        <div className="flex gap-1 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(sale)}
            disabled={deletingId === sale.id}
            aria-label="Edit"
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(sale.id)}
            disabled={deletingId === sale.id}
            aria-label="Delete"
            className="h-8 w-8 p-0"
          >
            <Trash2 className={`h-4 w-4 ${deletingId === sale.id ? "text-gray-400" : "text-red-600"}`} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
