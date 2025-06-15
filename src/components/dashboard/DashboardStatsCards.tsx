import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, TrendingUp, Bot } from 'lucide-react';
import { MiniTrendChart } from "./MiniTrendChart";

interface DashboardStatsCardsProps {
  stats: { totalProducts: number; activeProducts: number; aiGenerations: number };
}

// Dummy data for trends (replace with actual stats/historic if available)
const totalProductsTrend = [
  { x: 1, y: 20 },
  { x: 2, y: 22 },
  { x: 3, y: 21 },
  { x: 4, y: 24 },
  { x: 5, y: 27 },
  { x: 6, y: 29 },
  { x: 7, y: 30 },
];

const activeProductsTrend = [
  { x: 1, y: 18 },
  { x: 2, y: 18 },
  { x: 3, y: 19 },
  { x: 4, y: 20 },
  { x: 5, y: 21 },
  { x: 6, y: 22 },
  { x: 7, y: 24 },
];

const aiGenerationsTrend = [
  { x: 1, y: 5 },
  { x: 2, y: 8 },
  { x: 3, y: 8 },
  { x: 4, y: 12 },
  { x: 5, y: 15 },
  { x: 6, y: 15 },
  { x: 7, y: 16 },
];

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
      <Card className="bg-card border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">Semua produk Anda</p>
          <MiniTrendChart data={totalProductsTrend} color="#2563eb" animate={true}/>
        </CardContent>
      </Card>
      <Card className="bg-card border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeProducts}</div>
          <p className="text-xs text-muted-foreground">Siap dipasarkan</p>
          <MiniTrendChart data={activeProductsTrend} color="#22c55e" animate={true}/>
        </CardContent>
      </Card>
      <Card className="bg-card border sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.aiGenerations}</div>
          <p className="text-xs text-muted-foreground">Total bantuan AI</p>
          <MiniTrendChart data={aiGenerationsTrend} color="#f59e42" animate={true}/>
        </CardContent>
      </Card>
    </div>
  );
}
