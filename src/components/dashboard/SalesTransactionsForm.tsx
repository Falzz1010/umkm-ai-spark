
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Props {
  products: Product[];
  onFinished: () => void;
}

export function SalesTransactionsForm({ products, onFinished }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const product = products.find((p) => p.id === selectedProduct);

  useEffect(() => {
    if (!selectedProduct && products.length > 0) {
      setSelectedProduct(products[0].id);
    }
  }, [products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;
    if (quantity <= 0) {
      toast({
        title: "Jumlah tidak valid",
        description: "Masukkan jumlah penjualan minimal 1.",
        variant: "destructive",
      });
      return;
    }
    if ((product.stock ?? 0) < quantity) {
      toast({
        title: "Stok tidak cukup",
        description: "Stok produk tidak mencukupi untuk transaksi ini.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("sales_transactions").insert([
      {
        user_id: user.id,
        product_id: product.id,
        quantity,
        price: product.price,
      },
    ]);
    setLoading(false);
    if (error) {
      toast({
        title: "Gagal menyimpan penjualan",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Transaksi Berhasil",
      description: "Data penjualan telah direkam.",
    });
    setQuantity(1);
    onFinished?.();
  };

  return (
    <form className="w-full flex flex-col space-y-3" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-semibold">Produk</label>
        <select
          className="mt-1 border rounded w-full px-3 py-2 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          {products.map((p) => (
            <option
              value={p.id}
              key={p.id}
              className="text-gray-800 dark:text-zinc-100 bg-white dark:bg-zinc-900"
            >
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold">Jumlah Terjual</label>
        <input
          type="number"
          className="mt-1 border rounded w-full px-3 py-2 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min={1}
          max={product?.stock ?? undefined}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Stok tersedia: {product?.stock ?? 0}
        </p>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Catat Penjualan"}
      </Button>
    </form>
  );
}
