
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
  const [currentProducts, setCurrentProducts] = useState<Product[]>(products);

  const product = currentProducts.find((p) => p.id === selectedProduct);

  // Update current products when props change
  useEffect(() => {
    console.log('Products updated in SalesTransactionsForm:', products.length);
    setCurrentProducts(products);
  }, [products]);

  // Set default selected product
  useEffect(() => {
    if (!selectedProduct && currentProducts.length > 0) {
      setSelectedProduct(currentProducts[0].id);
      console.log('Default product selected:', currentProducts[0].id);
    }
  }, [currentProducts, selectedProduct]);

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
    console.log('Creating sales transaction:', { product_id: product.id, quantity, price: product.price });
    
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
      console.error('Error creating sales transaction:', error);
      toast({
        title: "Gagal menyimpan penjualan",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    console.log('Sales transaction created successfully');
    toast({
      title: "Transaksi Berhasil",
      description: "Data penjualan telah direkam dan stok otomatis terupdate.",
    });
    
    setQuantity(1);
    onFinished?.();
  };

  if (currentProducts.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-muted-foreground">Belum ada produk untuk dijual.</p>
        <p className="text-sm text-muted-foreground mt-1">Tambahkan produk terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <form className="w-full flex flex-col space-y-3" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-semibold">Produk</label>
        <select
          className="mt-1 border rounded w-full px-3 py-2 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedProduct}
          onChange={(e) => {
            setSelectedProduct(e.target.value);
            console.log('Product selected:', e.target.value);
          }}
        >
          {currentProducts.map((p) => (
            <option
              value={p.id}
              key={p.id}
              className="text-gray-800 dark:text-zinc-100 bg-white dark:bg-zinc-900"
            >
              {p.name} (Stok: {p.stock})
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
      <Button type="submit" disabled={loading || !product || (product.stock ?? 0) < quantity}>
        {loading ? "Menyimpan..." : "Catat Penjualan"}
      </Button>
    </form>
  );
}
