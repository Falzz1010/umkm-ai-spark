
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/types/database";

export type ProductAIRec = {
  product: Product;
  advice: "restock" | "promo" | "stop";
  reason: string;
};

export function useProductAIRecs(products: Product[]) {
  const { user } = useAuth();
  const [aiRecs, setAiRecs] = useState<ProductAIRec[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || products.length === 0) {
      setAiRecs([]);
      return;
    }
    setLoading(true);

    async function analyzeProducts() {
      // Ambil histori penjualan 30 hari terakhir
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const sinceStr = since.toISOString();

      const { data: salesData } = await supabase
        .from("sales_transactions")
        .select("product_id, quantity")
        .eq("user_id", user.id)
        .gte("created_at", sinceStr);

      // Hitung total quantity per product_id
      const salesMap: Record<string, number> = {};
      salesData?.forEach((trx) => {
        salesMap[trx.product_id] = (salesMap[trx.product_id] ?? 0) + trx.quantity;
      });

      // Cari rata-rata penjualan
      const quantities = Object.values(salesMap);
      const avgSales = quantities.length > 0 ? (quantities.reduce((a, b) => a + b, 0) / quantities.length) : 0;

      // Analisa & rekomendasi
      const recs: ProductAIRec[] = products.map((p) => {
        const sold = salesMap[p.id] ?? 0;
        const stock = Number(p.stock) ?? 0;
        let advice: ProductAIRec["advice"];
        let reason: string;

        if (sold >= avgSales && stock < 5) {
          advice = "restock";
          reason = `Penjualan tinggi (${sold} dalam 30 hari), stok rendah (${stock}).`;
        } else if (sold < avgSales / 2 && stock > 0) {
          advice = "promo";
          reason = `Penjualan rendah (${sold}), stok masih ada (${stock}).`;
        } else if (stock > 10 && sold === 0) {
          advice = "stop";
          reason = `Tidak laku 30 hari, stok (${stock}) banyak.`;
        } else {
          // Tidak diberi saran khusus
          return null;
        }
        return {
          product: p,
          advice,
          reason
        };
      }).filter(Boolean) as ProductAIRec[];

      setAiRecs(recs);
      setLoading(false);
    }

    analyzeProducts();
    // jalankan ulang jika daftar produk berubah
  }, [user, products]);

  return { aiRecs, loading };
}
