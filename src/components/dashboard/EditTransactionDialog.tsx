
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SaleRow } from "@/hooks/useSalesTransactions";

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: SaleRow | null;
  onSave: (newValues: { quantity: number; price: number }) => void;
}

export function EditTransactionDialog({ open, onOpenChange, transaction, onSave }: EditTransactionDialogProps) {
  const [quantity, setQuantity] = useState<number>(transaction?.quantity ?? 1);
  const [price, setPrice] = useState<number>(transaction?.price ?? 0);

  // Reset values on new transaction
  React.useEffect(() => {
    if (transaction) {
      setQuantity(transaction.quantity);
      setPrice(Number(transaction.price));
    }
  }, [transaction]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaksi</DialogTitle>
          <DialogDescription>
            Ubah detail transaksi penjualan untuk produk <b>{transaction?.product_name}</b>.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ quantity, price });
          }}
        >
          <div className="space-y-3 my-3">
            <div>
              <label className="block mb-1 text-sm">Jumlah</label>
              <Input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Harga Jual/unit</label>
              <Input
                type="number"
                value={price}
                min={0}
                step={100}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Simpan</Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Batal
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
