
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, TrendingUp, Bot } from 'lucide-react';

interface DashboardStatsCardsProps {
  stats: { totalProducts: number; activeProducts: number; aiGenerations: number };
}

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
        </CardContent>
      </Card>
    </div>
  );
}
