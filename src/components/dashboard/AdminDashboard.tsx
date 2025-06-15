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
    <div className="p-2 sm:p-4 lg:p-8 max-w-7xl mx-auto">
      <DashboardHeader
        title="Dashboard Admin"
        subtitle="Kelola pengguna dan monitor aktivitas platform"
      />

      <div className="mb-6 lg:mb-8">
        <AdminStatsCards stats={stats} />
      </div>

      <div className="rounded-xl shadow-md bg-background/60 ring-1 ring-border/40 p-0 sm:p-2 sm:pt-4 space-y-6">
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 sticky top-0 z-10 bg-background/90 backdrop-blur border rounded-lg p-1 mb-2">
            <TabsTrigger value="analytics" className="text-xs lg:text-sm font-semibold data-[state=active]:bg-primary/90 data-[state=active]:text-white transition-all">
              <BarChart3 className="h-4 w-4 mr-1 lg:mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products" className="text-xs lg:text-sm font-semibold data-[state=active]:bg-primary/90 data-[state=active]:text-white transition-all">
              Produk
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs lg:text-sm font-semibold data-[state=active]:bg-primary/90 data-[state=active]:text-white transition-all">
              Pengguna
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs lg:text-sm font-semibold data-[state=active]:bg-primary/90 data-[state=active]:text-white transition-all">
              AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-tr from-background via-card/80 to-background/80">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Analytics & Insights</CardTitle>
                <CardDescription>
                  Visualisasi data dan tren aktivitas platform
                </CardDescription>
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
    </div>
  );
}
