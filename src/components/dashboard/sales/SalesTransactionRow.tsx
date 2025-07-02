
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
      <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-3">
        <div className="flex flex-col">
          <span className="font-medium">
            {new Date(sale.created_at).toLocaleDateString("id-ID", { 
              day: "2-digit", 
              month: "short"
            })}
          </span>
          <span className="text-xs text-muted-foreground sm:hidden">
            {new Date(sale.created_at).toLocaleDateString("id-ID", { year: "2-digit" })}
          </span>
        </div>
      </TableCell>
      <TableCell className="p-2 sm:p-3">
        <div className="max-w-[80px] sm:max-w-[150px] truncate">
          <span title={sale.product_name} className="text-xs sm:text-sm font-medium">
            {sale.product_name}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center font-medium text-xs sm:text-sm p-2 sm:p-3">
        {sale.quantity}
      </TableCell>
      <TableCell className="text-right font-medium text-xs sm:text-sm p-2 sm:p-3">
        <div className="flex flex-col sm:flex-row sm:justify-end">
          <span className="text-xs sm:text-sm">
            Rp {Number(sale.price).toLocaleString("id-ID")}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right font-semibold text-xs sm:text-sm p-2 sm:p-3">
        <div className="flex flex-col sm:flex-row sm:justify-end">
          <span className="text-xs sm:text-sm text-green-600 dark:text-green-400">
            Rp {Number(sale.total).toLocaleString("id-ID")}
          </span>
        </div>
      </TableCell>
      <TableCell className="p-1 sm:p-3">
        <div className="flex gap-1 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(sale)}
            disabled={deletingId === sale.id}
            aria-label="Edit"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(sale.id)}
            disabled={deletingId === sale.id}
            aria-label="Delete"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Trash2 className={`h-3 w-3 sm:h-4 sm:w-4 ${deletingId === sale.id ? "text-gray-400" : "text-red-600"}`} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
