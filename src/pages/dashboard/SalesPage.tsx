
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
    <div className="space-y-6">
      <DashboardHeader 
        title="Penjualan"
        subtitle="Kelola transaksi dan monitor riwayat penjualan"
      />
      
      <div className="bg-white dark:bg-card rounded-lg border shadow-sm p-6">
        <TabSales 
          products={products} 
          salesKey={salesKey} 
          setSalesKey={setSalesKey} 
        />
      </div>
    </div>
  );
}
