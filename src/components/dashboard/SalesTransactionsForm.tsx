
import React, { useEffect, useState } from "react";
import { Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import { useSecureActions } from "@/hooks/common/useSecureActions";
import { useRoleValidation } from "@/hooks/common/useRoleValidation";
import { RoleGuard } from "@/components/common/RoleGuard";
import { useSweetAlert } from "@/hooks/useSweetAlert";

interface Props {
  products: Product[];
  onFinished: () => void;
}

export function SalesTransactionsForm({ products, onFinished }: Props) {
  const { createItem, loading } = useSecureActions();
  const { canAccess } = useRoleValidation();
  const { showError } = useSweetAlert();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
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
    if (!product) return;
    
    if (quantity <= 0) {
      showError("Jumlah Tidak Valid", "Jumlah harus lebih dari 0");
      return;
    }
    
    if ((product.stock ?? 0) < quantity) {
      showError("Stok Tidak Cukup", `Stok tersedia hanya ${product.stock}, tidak dapat menjual ${quantity} unit`);
      return;
    }
    
    console.log('Creating sales transaction:', { product_id: product.id, quantity, price: product.price });
    
    const result = await createItem(
      'sales_transactions',
      {
        product_id: product.id,
        quantity,
        price: product.price || 0
      },
      ['user'],
      'Transaksi penjualan',
      true
    );
    
    if (result.success) {
      console.log('Sales transaction created successfully');
      setQuantity(1);
      onFinished?.();
    }
  };

  if (!canAccess(['user'])) {
    return (
      <RoleGuard allowedRoles={['user']}>
        <div />
      </RoleGuard>
    );
  }

  if (currentProducts.length === 0) {
    return (
      <div className="w-full text-center py-6 sm:py-8">
        <p className="text-muted-foreground text-sm sm:text-base">Belum ada produk untuk dijual.</p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Tambahkan produk terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <form className="w-full flex flex-col space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm sm:text-base font-semibold">Produk</label>
        <select
          className="w-full border rounded px-3 py-2 sm:py-3 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
      
      <div className="space-y-2">
        <label className="text-sm sm:text-base font-semibold">Jumlah Terjual</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2 sm:py-3 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          min={1}
          max={product?.stock ?? undefined}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
        <p className="text-xs sm:text-sm text-muted-foreground">
          Stok tersedia: {product?.stock ?? 0}
        </p>
      </div>
      
      <Button 
        type="submit" 
        disabled={loading === 'create-new' || !product || (product.stock ?? 0) < quantity}
        className="relative w-full h-11 sm:h-12 text-sm sm:text-base"
        size="lg"
      >
        {loading === 'create-new' ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Menyimpan...
          </>
        ) : (
          "Catat Penjualan"
        )}
      </Button>
    </form>
  );
}
