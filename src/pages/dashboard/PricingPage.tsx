
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
    <div className="space-y-3 sm:space-y-4 lg:space-y-6 w-full max-w-none min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="px-2 sm:px-4 lg:px-6">
        <DashboardHeader 
          title="Smart Pricing Assistant"
          subtitle="Dapatkan saran harga optimal dengan AI"
        />
      </div>
      
      <div className="w-full">
        <SmartPricingAssistant 
          products={products} 
          onPriceUpdate={refreshData} 
        />
      </div>
    </div>
  );
}
