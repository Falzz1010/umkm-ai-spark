
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import OverviewPage from '@/pages/dashboard/OverviewPage';
import ProductsPage from '@/pages/dashboard/ProductsPage';
import AnalyticsPage from '@/pages/dashboard/AnalyticsPage';
import AIPage from '@/pages/dashboard/AIPage';
import SalesPage from '@/pages/dashboard/SalesPage';
import PricingPage from '@/pages/dashboard/PricingPage';

export function UserDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </DashboardLayout>
  );
}
