
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types/database";

// Jenis insight
export type ProductAIRec = {
  product: Product;
  advice: "restock" | "promo" | "stop";
  reason: string;
};

export type ProductTrendPrediction = {
  product: Product;
  trend: "up" | "down" | "flat";
  score: number; // representasi kekuatan prediksi tren (misal: growth rate)
  reason: string;
};

export type ProductPriceSuggestion = {
  product: Product;
  suggestedPrice: number;
  reason: string;
};

export function useProductAIInsights(products: Product[]) {
  const { user } = useAuth();
  const [aiRecs, setAiRecs] = useState<ProductAIRec[]>([]);
  const [trendPredictions, setTrendPredictions] = useState<ProductTrendPrediction[]>([]);
  const [priceSuggestions, setPriceSuggestions] = useState<ProductPriceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || products.length === 0) {
      setAiRecs([]);
      setTrendPredictions([]);
      setPriceSuggestions([]);
      return;
    }
    setLoading(true);

    async function analyzeProducts() {
      // 1. Ambil histori penjualan 60 hari terakhir untuk deteksi tren per-produk
      const sinceDate = new Date(); sinceDate.setDate(sinceDate.getDate() - 60);
      const sinceStr = sinceDate.toISOString();

      const { data: salesData } = await supabase
        .from("sales_transactions")
        .select("product_id, quantity, price, created_at")
        .eq("user_id", user.id)
        .gte("created_at", sinceStr);

      // Kelompokkan sales by product_id + by day
      const salesMap: Record<string, { total: number; last30: number; grouped: Record<string, number>; prices: number[] }> = {};
      salesData?.forEach((trx) => {
        if (!salesMap[trx.product_id]) {
          salesMap[trx.product_id] = { total: 0, last30: 0, grouped: {}, prices: [] };
        }
        salesMap[trx.product_id].total += trx.quantity;
        salesMap[trx.product_id].prices.push(trx.price);
        // grouping harian
        const day = trx.created_at.split("T")[0];
        salesMap[trx.product_id].grouped[day] = (salesMap[trx.product_id].grouped[day] ?? 0) + trx.quantity;
        // last 30 hari
        const d = new Date(trx.created_at);
        const now = new Date();
        const diff = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
        if (diff <= 30) salesMap[trx.product_id].last30 += trx.quantity;
      });

      // Rata-rata total penjualan semua produk 30 hari terakhir
      const avgSales =
        products.length > 0
          ? (Object.values(salesMap).reduce((acc, v) => acc + v.last30, 0) / products.length)
          : 0;

      // 2. Rekomendasi AI stok/promo/stop (sama seperti sebelumnya)
      const recs: ProductAIRec[] = products.map((p) => {
        const sold = salesMap[p.id]?.last30 ?? 0;
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
          return null;
        }
        return { product: p, advice, reason };
      }).filter(Boolean) as ProductAIRec[];

      // 3. Prediksi Tren: Bandingkan penjualan 30 hari terakhir vs. sebelumnya 30 hari (growth trend)
      const trendArr: ProductTrendPrediction[] = products.map((p) => {
        const sales = salesMap[p.id]?.grouped || {};
        // hitung 30 hari terakhir vs 30 hari sebelumnya
        let last30 = 0, prev30 = 0;
        const now = new Date();
        Object.entries(sales).forEach(([day, qty]) => {
          const d = new Date(day);
          const diff = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
          if (diff <= 30) last30 += qty;
          else if (diff > 30 && diff <= 60) prev30 += qty;
        });
        const growth = (prev30 === 0 && last30 > 0) ? 1 : (prev30 > 0 ? (last30 - prev30) / prev30 : 0);
        let trend: ProductTrendPrediction["trend"] = "flat";
        let reason = "Stabil.";
        if (growth > 0.2) {
          trend = "up";
          reason = `Naik ${((growth) * 100).toFixed(1)}% (${prev30} → ${last30} unit).`;
        } else if (growth < -0.2) {
          trend = "down";
          reason = `Turun ${((-growth) * 100).toFixed(1)}% (${prev30} → ${last30} unit).`;
        }
        return {
          product: p,
          trend,
          score: growth,
          reason
        };
      });

      // 4. Rekomendasi Harga Ideal (AI Sederhana)
      // Dasar: harga rata-rata jual, margin min 20% di atas HPP, harga pasar jika sangat rendah atau tinggi.
      const priceArr: ProductPriceSuggestion[] = products.map((p) => {
        const cost = Number(p.cost) ?? 0;
        // Harga rata-rata jual 60 hari terakhir
        const prices = salesMap[p.id]?.prices.length ? salesMap[p.id].prices : [Number(p.price) || 0];
        const avgSoldPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
        // Ideal: minimal 20% di atas cost dan ≥ harga rata-rata, disarankan dibulatkan ke ribuan terdekat
        let idealPrice = Math.max(avgSoldPrice, cost * 1.2);
        idealPrice = Math.round(idealPrice / 1000) * 1000;
        let reason = `Minimal 20% di atas HPP (Rp${cost}), dan rata-rata jual Rp${avgSoldPrice.toFixed(0)}.`;
        if (avgSoldPrice > idealPrice && avgSoldPrice > 0) {
          reason = `Harga rata-rata jual Rp${avgSoldPrice.toFixed(0)} > margin 20%. Ikuti pasar jika permintaan stabil.`;
          idealPrice = Math.round(avgSoldPrice / 1000) * 1000;
        }
        // Jangan sarankan < cost!
        if (idealPrice < cost) idealPrice = Math.ceil(cost * 1.1 / 1000) * 1000;
        return {
          product: p,
          suggestedPrice: idealPrice,
          reason
        };
      });

      setAiRecs(recs);
      setTrendPredictions(trendArr);
      setPriceSuggestions(priceArr);
      setLoading(false);
    }

    analyzeProducts();
  }, [user, products]);

  return { aiRecs, trendPredictions, priceSuggestions, loading };
}
