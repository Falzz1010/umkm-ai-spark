
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from './DashboardHeader';
import { DashboardLayout } from './DashboardLayout';
import { DashboardLoadingSkeleton } from './DashboardLoadingSkeleton';
import { DashboardStatsSection } from './DashboardStatsSection';
import { DashboardTabs } from './DashboardTabs';
import { GeminiInsightsCard } from './GeminiInsightsCard';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';

export function UserDashboard() {
  const { profile } = useAuth();
  const { 
    products, 
    stats, 
    salesKey, 
    setSalesKey, 
    analyticsData, 
    refreshData,
    loading
  } = useDashboardData();
  
  const {
    filterCategory,
    setFilterCategory,
    filterSearch,
    setFilterSearch,
    filterStatus,
    setFilterStatus,
    filterStok,
    setFilterStok,
    filteredProducts,
    omzet,
    laba,
    handleExportExcel,
    handleExportReport
  } = useDashboardFilters(products);

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="animate-slide-up">
        <DashboardHeader 
          title={`Selamat datang, ${profile?.full_name || 'User'}`}
          subtitle="Kelola produk dan dapatkan bantuan AI untuk bisnis Anda"
        />
      </div>

      <DashboardStatsSection 
        stats={stats} 
        omzet={omzet} 
        laba={laba} 
      />

      {/* Gemini AI Business Intelligence */}
      <div className="mb-6 animate-slide-up" style={{'--index': 2} as any}>
        <GeminiInsightsCard products={products} />
      </div>

      <DashboardTabs
        products={products}
        stats={stats}
        salesKey={salesKey}
        setSalesKey={setSalesKey}
        analyticsData={analyticsData}
        filteredProducts={filteredProducts}
        filterCategory={filterCategory}
        filterSearch={filterSearch}
        filterStatus={filterStatus}
        filterStok={filterStok}
        setFilterCategory={setFilterCategory}
        setFilterSearch={setFilterSearch}
        setFilterStatus={setFilterStatus}
        setFilterStok={setFilterStok}
        handleExportExcel={handleExportExcel}
        handleExportReport={handleExportReport}
        refreshData={refreshData}
      />
    </DashboardLayout>
  );
}
