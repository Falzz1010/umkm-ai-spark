
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
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50'
    },
    {
      title: 'Lihat Analytics',
      description: 'Analisis performa bisnis',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'text-green-600 bg-green-50 dark:bg-green-950/50'
    },
    {
      title: 'AI Assistant',
      description: 'Dapatkan bantuan AI',
      icon: Bot,
      href: '/dashboard/ai',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50'
    },
    {
      title: 'Smart Pricing',
      description: 'Optimasi harga produk',
      icon: DollarSign,
      href: '/dashboard/pricing',
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/50'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
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
      <div className="animate-slide-up">
        <GeminiInsightsCard products={products} />
      </div>

      {/* Quick Actions */}
      <Card className="animate-slide-up shadow-smooth">
        <CardHeader className="card-mobile-header">
          <CardTitle className="flex items-center gap-2 text-responsive-base">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Aksi Cepat
          </CardTitle>
        </CardHeader>
        <CardContent className="card-mobile">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} to={action.href} className="group">
                  <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover border-0 bg-gray-50/50 dark:bg-muted/30">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 rounded-lg ${action.color} transition-transform group-hover:scale-110`}>
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
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
