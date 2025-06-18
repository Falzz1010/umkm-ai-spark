
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TabAnalytics } from '@/components/dashboard/TabAnalytics';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardLoadingSkeleton } from '@/components/dashboard/DashboardLoadingSkeleton';

export default function AnalyticsPage() {
  const { products, analyticsData, loading } = useDashboardData();

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Analytics & Insights"
        subtitle="Analisis mendalam tentang performa bisnis Anda"
      />
      
      <div className="bg-white dark:bg-card rounded-lg border shadow-sm p-6">
        <TabAnalytics analyticsData={analyticsData} products={products} />
      </div>
    </div>
  );
}
