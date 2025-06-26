
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
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-1 sm:px-0">
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
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ShoppingCart className="h-5 w-5 text-primary flex-shrink-0" />
            Aksi Cepat
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} to={action.href} className="group">
                  <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover border-0 bg-gray-50/50 dark:bg-muted/30 h-full">
                    <CardContent className="p-4 sm:p-5 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 rounded-lg ${action.color} transition-transform group-hover:scale-110 flex-shrink-0`}>
                          <Icon className="h-5 w-5 sm:h-5 sm:w-5" />
                        </div>
                        <ArrowRight className="h-4 w-4 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-base group-hover:text-primary transition-colors leading-tight mb-2">
                          {action.title}
                        </h3>
                        <p className="text-sm sm:text-sm text-muted-foreground leading-relaxed">
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
