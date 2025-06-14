
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AdminStatsCards } from './admin/AdminStatsCards';
import { AdminProductsTab } from './admin/AdminProductsTab';
import { AdminUsersTab } from './admin/AdminUsersTab';
import { AdminAITab } from './admin/AdminAITab';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

export function AdminDashboard() {
  const {
    stats,
    products,
    users,
    aiGenerations,
    analyticsData,
    deleteProduct
  } = useAdminDashboard();

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <DashboardHeader 
        title="Dashboard Admin"
        subtitle="Kelola pengguna dan monitor aktivitas platform"
      />

      <AdminStatsCards stats={stats} />

      {/* Data Tables */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="analytics" className="text-xs lg:text-sm">
            <BarChart3 className="h-4 w-4 mr-1 lg:mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="products" className="text-xs lg:text-sm">Produk</TabsTrigger>
          <TabsTrigger value="users" className="text-xs lg:text-sm">Pengguna</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs lg:text-sm">AI</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>Visualisasi data dan tren aktivitas platform</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsCharts data={analyticsData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <AdminProductsTab products={products} onDeleteProduct={deleteProduct} />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsersTab users={users} />
        </TabsContent>

        <TabsContent value="ai">
          <AdminAITab aiGenerations={aiGenerations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
