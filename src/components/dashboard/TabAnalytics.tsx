import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AnalyticsCharts } from './AnalyticsCharts';
import { Product } from '@/types/database';
import { useProductAIInsights } from "@/hooks/useProductAIInsights";
import { Badge } from '@/components/ui/badge';
import { Flame, Lightbulb, PauseCircle } from "lucide-react";

interface TabAnalyticsProps {
  analyticsData: any;
  products?: Product[]; // Tambahkan products supaya bisa dikirim dari dashboard
}

export function TabAnalytics({ analyticsData, products = [] }: TabAnalyticsProps) {
  const { aiRecs, loading, trendPredictions, priceSuggestions } = useProductAIInsights(products);

  const adviceLabel = {
    restock: { color: "bg-green-200 text-green-800", icon: <Flame className="w-4 h-4" /> , text: "Restock!" },
    promo: { color: "bg-yellow-100 text-yellow-800", icon: <Lightbulb className="w-4 h-4" />, text: "Butuh Promo" },
    stop: { color: "bg-gray-200 text-gray-700", icon: <PauseCircle className="w-4 h-4" />, text: "Pertimbangkan Stop" }
  };

  // Saring dan tampilkan tren yang bukan "flat"
  const hotTrends = trendPredictions.filter(t => t.trend !== "flat");
  // Harga ideal relevan jika harga yang disarankan berbeda dari harga sekarang
  const recommendedPrices = priceSuggestions.filter(s => Math.abs((s.product.price ?? 0) - s.suggestedPrice) > 500);

  return (
    <div className="space-y-6">
      {/* Rekomendasi AI (Stok) */}
      {products && aiRecs.length > 0 && (
        <Card className="border-l-4 border-primary bg-primary/5">
          <CardHeader>
            <CardTitle>🔥 Rekomendasi AI untuk Performa Produk</CardTitle>
            <CardDescription>
              Saran otomatis berdasarkan penjualan & stok 30 hari terakhir untuk membantu keputusan bisnis Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {aiRecs.map(({ product, advice, reason }) => (
                <div key={product.id} className="flex items-center justify-between rounded px-2 py-1 bg-white dark:bg-muted/50 shadow border">
                  <div>
                    <span className="font-bold">{product.name}</span>
                    <span className="ml-2">{reason}</span>
                  </div>
                  <Badge className={adviceLabel[advice].color + " flex items-center gap-1"}>
                    {adviceLabel[advice].icon}
                    {adviceLabel[advice].text}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Prediksi Tren Penjualan */}
      {products && hotTrends.length > 0 && (
        <Card className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/30">
          <CardHeader>
            <CardTitle>📈 Prediksi Tren Penjualan Produk</CardTitle>
            <CardDescription>
              AI memprediksi tren naik/turun produk untuk periode 30 hari ke depan berdasarkan histori.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {hotTrends.map(({ product, trend, reason }) => (
                <div key={product.id} className="flex items-center justify-between px-2 py-1 bg-white dark:bg-muted/70 rounded border shadow">
                  <div>
                    <span className="font-bold">{product.name}</span>
                    <span className="ml-2">{trend === "up" ? "🚀 Potensi Melejit" : "⬇️ Potensi Turun"} — <span className="italic">{reason}</span></span>
                  </div>
                  <span className={`font-semibold text-${trend === "up" ? "green" : "red"}-600`}>
                    {trend === "up" ? "Tren Naik" : "Tren Turun"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Penentu Harga Otomatis */}
      {products && recommendedPrices.length > 0 && (
        <Card className="border-l-4 border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30">
          <CardHeader>
            <CardTitle>💰 Rekomendasi Harga Jual Ideal (AI)</CardTitle>
            <CardDescription>
              AI menghitung harga jual ideal & margin sehat, sesuai penjualan & HPP. Bandingkan dengan harga saat ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {recommendedPrices.map(({ product, suggestedPrice, reason }) => (
                <div key={product.id} className="flex flex-col sm:flex-row items-baseline justify-between px-2 py-1 bg-white dark:bg-muted/70 rounded border shadow">
                  <div>
                    <span className="font-bold">{product.name}</span>
                    <span className="ml-2 text-sm font-medium">Harga saat ini: <span className="line-through text-red-500">Rp{product.price?.toLocaleString("id-ID")}</span></span>
                    <span className="ml-2">Saran: <span className="text-cyan-700 font-semibold">Rp{suggestedPrice.toLocaleString("id-ID")}</span></span>
                    <span className="block ml-2 text-xs text-gray-500">{reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Analytics</CardTitle>
          <CardDescription>
            Analisis performa bisnis dan aktivitas penggunaan platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsCharts data={analyticsData} />
        </CardContent>
      </Card>
    </div>
  );
}
