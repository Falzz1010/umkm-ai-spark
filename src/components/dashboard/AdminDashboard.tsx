
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Package, Users, Bot, TrendingUp } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AdminStatsCards } from './admin/AdminStatsCards';
import { AdminProductsTab } from './admin/AdminProductsTab';
import { AdminUsersTab } from './admin/AdminUsersTab';
import { AdminAITab } from './admin/AdminAITab';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { RoleGuard } from '@/components/common/RoleGuard';
import { LoadingStateCard } from '@/components/common/LoadingStateCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const tabTriggerClassName = "flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium px-4 py-3 rounded-lg lg:rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-white/95 data-[state=active]:to-gray-50/90 data-[state=active]:shadow-sm data-[state=active]:shadow-primary/5 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:border data-[state=active]:border-primary/15 transition-all duration-300 ease-out hover:bg-white/70 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] min-h-[48px]";

export function AdminDashboard() {
  const {
    stats,
    products,
    users,
    aiGenerations,
    analyticsData,
    deleteProduct,
    loading
  } = useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200/60 dark:bg-background p-2 sm:p-4 lg:p-8 animate-fade-in flex items-center justify-center page-transition">
        <div className="w-full max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="space-y-2 sm:space-y-4 animate-slide-up">
            <LoadingStateCard rows={1} showHeader={false} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingStateCard key={i} rows={2} showHeader={false} />
            ))}
          </div>
          <LoadingStateCard rows={8} />
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gradient-to-br from-gray-100/80 via-gray-150/60 to-gray-200/40 dark:bg-gradient-to-br dark:from-background dark:via-background dark:to-muted/20 p-2 sm:p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto animate-fade-in page-transition">
        <div className="animate-slide-up">
          <DashboardHeader
            title="Dashboard Admin"
            subtitle="Kelola pengguna dan monitor aktivitas platform"
          />
        </div>

        {/* Enhanced Stats Cards with responsive layout */}
        <div className="mb-4 sm:mb-6 lg:mb-8 animate-slide-up" style={{'--index': 1} as React.CSSProperties}>
          <AdminStatsCards stats={stats} />
        </div>

        {/* Main Content with enhanced responsive design */}
        <div className="animate-slide-up" style={{'--index': 2} as React.CSSProperties}>
          <div className="bg-white/90 dark:bg-card/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-sm border border-gray-200/60 dark:border-border/50 p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:shadow-md">
            <Tabs defaultValue="analytics" className="space-y-3 sm:space-y-4 lg:space-y-6">
              <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                <TabsList className="inline-flex w-max h-auto gap-1 sm:gap-2 bg-gradient-to-r from-gray-100/60 via-gray-150/40 to-gray-100/60 dark:bg-gradient-to-r dark:from-muted/40 dark:via-muted/60 dark:to-muted/40 p-1.5 sm:p-2 rounded-xl shadow-inner backdrop-blur-sm border border-gray-200/40 dark:border-border/30">
                  <TabsTrigger value="analytics" className={tabTriggerClassName}>
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="products" className={tabTriggerClassName}>
                    <Package className="h-4 w-4" />
                    <span>Produk</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className={tabTriggerClassName}>
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai" className={tabTriggerClassName}>
                    <Bot className="h-4 w-4" />
                    <span>AI</span>
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" className="h-2" />
              </ScrollArea>

              {/* Tab Contents with enhanced responsive animations */}
              <TabsContent value="analytics" className="animate-fade-in">
                <Card className="bg-gradient-to-br from-white/95 to-gray-50/80 dark:bg-gradient-to-br dark:from-card/90 dark:to-card/60 backdrop-blur-sm border-gray-200/60 dark:border-border/50 shadow-sm rounded-xl lg:rounded-2xl transition-all duration-300 hover:shadow-md">
                  <CardHeader className="pb-2 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg w-fit">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                          Analytics & Insights
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                          Visualisasi data dan tren aktivitas platform
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 p-3 sm:p-6">
                    <AnalyticsCharts data={analyticsData} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="animate-fade-in">
                <AdminProductsTab products={products} onDeleteProduct={deleteProduct} />
              </TabsContent>

              <TabsContent value="users" className="animate-fade-in">
                <AdminUsersTab users={users} />
              </TabsContent>

              <TabsContent value="ai" className="animate-fade-in">
                <AdminAITab aiGenerations={aiGenerations} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
