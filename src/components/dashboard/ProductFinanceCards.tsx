
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HandCoins, Calculator } from 'lucide-react';
import { MiniTrendChart } from "./MiniTrendChart";
import { useRealSalesData } from '@/hooks/useRealSalesData';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductFinanceCards() {
  const { totalOmzet, totalLaba, loading } = useRealSalesData();

  // Generate trend data based on real sales (simplified example)
  const omzetTrend = [
    { x: "Sen", y: totalOmzet * 0.8 },
    { x: "Sel", y: totalOmzet * 0.9 },
    { x: "Rab", y: totalOmzet * 1.1 },
    { x: "Kam", y: totalOmzet * 0.95 },
    { x: "Jum", y: totalOmzet * 1.05 },
    { x: "Sab", y: totalOmzet * 1.00 },
    { x: "Min", y: totalOmzet },
  ];
  
  const labaTrend = [
    { x: "Sen", y: totalLaba * 0.7 },
    { x: "Sel", y: totalLaba * 0.75 },
    { x: "Rab", y: totalLaba * 1.1 },
    { x: "Kam", y: totalLaba * 0.95 },
    { x: "Jum", y: totalLaba * 1.04 },
    { x: "Sab", y: totalLaba * 0.98 },
    { x: "Min", y: totalLaba },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-3">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-100 dark:border-green-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Omzet Terjual</CardTitle>
          <HandCoins className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            Rp {totalOmzet.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-muted-foreground">
            Dari penjualan aktual yang tercatat
          </p>
          <MiniTrendChart data={omzetTrend} color="#16a34a" animate={true}/>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border border-yellow-100 dark:border-yellow-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Laba Terealisasi</CardTitle>
          <Calculator className="h-5 w-5 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-700">
            Rp {totalLaba.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-muted-foreground">
            Laba bersih dari penjualan tercatat
          </p>
          <MiniTrendChart data={labaTrend} color="#eab308" animate={true}/>
        </CardContent>
      </Card>
    </div>
  );
}
