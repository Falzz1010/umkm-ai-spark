
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TabSales } from '@/components/dashboard/TabSales';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardLoadingSkeleton } from '@/components/dashboard/DashboardLoadingSkeleton';

export default function SalesPage() {
  const { products, salesKey, setSalesKey, loading } = useDashboardData();

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <DashboardHeader 
        title="Penjualan"
        subtitle="Kelola transaksi dan monitor riwayat penjualan"
      />
      
      <div className="bg-white dark:bg-card rounded-lg border shadow-sm p-3 sm:p-4 lg:p-6 w-full max-w-full overflow-hidden">
        <TabSales 
          products={products} 
          salesKey={salesKey} 
          setSalesKey={setSalesKey} 
        />
      </div>
    </div>
  );
}
