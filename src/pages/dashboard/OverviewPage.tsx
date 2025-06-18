
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStatsSection } from '@/components/dashboard/DashboardStatsSection';
import { GeminiInsightsCard } from '@/components/dashboard/GeminiInsightsCard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { DashboardLoadingSkeleton } from '@/components/dashboard/DashboardLoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, BarChart3, Bot, ShoppingCart, DollarSign, ArrowRight } from 'lucide-react';

export default function OverviewPage() {
  const { profile } = useAuth();
  const { products, stats, loading } = useDashboardData();
  const { omzet, laba } = useDashboardFilters(products);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  const quickActions = [
    {
      title: 'Kelola Produk',
      description: 'Tambah, edit, atau hapus produk',
      icon: Package,
      href: '/dashboard/products',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Lihat Analytics',
      description: 'Analisis performa bisnis',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'AI Assistant',
      description: 'Dapatkan bantuan AI',
      icon: Bot,
      href: '/dashboard/ai',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Smart Pricing',
      description: 'Optimasi harga produk',
      icon: DollarSign,
      href: '/dashboard/pricing',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title={`Selamat datang, ${profile?.full_name || 'User'}`}
        subtitle="Kelola produk dan dapatkan bantuan AI untuk bisnis Anda"
      />

      <DashboardStatsSection 
        stats={stats} 
        omzet={omzet} 
        laba={laba} 
      />

      {/* Gemini AI Business Intelligence */}
      <GeminiInsightsCard products={products} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Aksi Cepat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} to={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-3">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {action.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
