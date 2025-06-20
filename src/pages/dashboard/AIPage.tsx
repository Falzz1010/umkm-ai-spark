
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TabAI } from '@/components/dashboard/TabAI';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardLoadingSkeleton } from '@/components/dashboard/DashboardLoadingSkeleton';

export default function AIPage() {
  const { products, refreshData, loading } = useDashboardData();

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="AI Assistant"
        subtitle="Dapatkan bantuan AI untuk mengoptimalkan bisnis Anda"
      />
      
      <div className="bg-white dark:bg-card rounded-lg border shadow-sm p-6">
        <TabAI products={products} onGenerationComplete={refreshData} />
      </div>
    </div>
  );
}
