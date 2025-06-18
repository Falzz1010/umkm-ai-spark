
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SmartPricingAssistant } from '@/components/dashboard/SmartPricingAssistant';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardLoadingSkeleton } from '@/components/dashboard/DashboardLoadingSkeleton';

export default function PricingPage() {
  const { products, refreshData, loading } = useDashboardData();

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Smart Pricing Assistant"
        subtitle="Dapatkan saran harga optimal dengan AI"
      />
      
      <div className="bg-white dark:bg-card rounded-lg border shadow-sm p-6">
        <SmartPricingAssistant 
          products={products} 
          onPriceUpdate={refreshData} 
        />
      </div>
    </div>
  );
}
