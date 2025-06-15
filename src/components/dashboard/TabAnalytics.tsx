
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AnalyticsCharts } from './AnalyticsCharts';
import { Product } from '@/types/database';
import { useProductAIRecs } from "@/hooks/useProductAIRecs";
import { Badge } from '@/components/ui/badge';
import { Flame, Lightbulb, PauseCircle } from "lucide-react";

interface TabAnalyticsProps {
  analyticsData: any;
  products?: Product[]; // Tambahkan products supaya bisa dikirim dari dashboard
}

export function TabAnalytics({ analyticsData, products = [] }: TabAnalyticsProps) {
  const { aiRecs, loading } = useProductAIRecs(products);

  const adviceLabel = {
    restock: { color: "bg-green-200 text-green-800", icon: <Flame className="w-4 h-4" /> , text: "Restock!" },
    promo: { color: "bg-yellow-100 text-yellow-800", icon: <Lightbulb className="w-4 h-4" />, text: "Butuh Promo" },
    stop: { color: "bg-gray-200 text-gray-700", icon: <PauseCircle className="w-4 h-4" />, text: "Pertimbangkan Stop" }
  };

  return (
    <div className="space-y-6">
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
