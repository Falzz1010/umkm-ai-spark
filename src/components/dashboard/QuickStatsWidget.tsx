
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useProductFinancials } from '@/hooks/useProductFinancials';

export function QuickStatsWidget() {
  const { products, stats } = useDashboardData();
  const { omzet, laba } = useProductFinancials(products);

  const statsData = [
    {
      title: 'Total Produk',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600 bg-blue-100',
      trend: '+12%'
    },
    {
      title: 'Produk Aktif',
      value: stats.activeProducts,
      icon: ShoppingCart,
      color: 'text-green-600 bg-green-100',
      trend: '+8%'
    },
    {
      title: 'Total Omzet',
      value: `Rp ${omzet.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'text-yellow-600 bg-yellow-100',
      trend: '+15%'
    },
    {
      title: 'Estimasi Laba',
      value: `Rp ${laba.toLocaleString('id-ID')}`,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
      trend: '+22%'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex items-center text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.title}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
