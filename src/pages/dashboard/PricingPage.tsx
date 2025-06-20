
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
    <div className="space-y-4 lg:space-y-6 w-full">
      <DashboardHeader 
        title="Smart Pricing Assistant"
        subtitle="Dapatkan saran harga optimal dengan AI"
      />
      
      <div className="w-full">
        <SmartPricingAssistant 
          products={products} 
          onPriceUpdate={refreshData} 
        />
      </div>
    </div>
  );
}
