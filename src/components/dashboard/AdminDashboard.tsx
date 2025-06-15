
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
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="min-h-screen bg-background p-2 sm:p-4 lg:p-8 animate-fade-in flex items-center justify-center page-transition">
        <div className="w-full max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
          <div className="space-y-2 sm:space-y-4 animate-slide-up">
            <Skeleton className="h-8 sm:h-10 lg:h-12 w-48 sm:w-56 lg:w-64 shadow-smooth" />
            <Skeleton className="h-4 sm:h-5 lg:h-6 w-32 sm:w-36 lg:w-40 shadow-smooth" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 stagger-children">
            <Skeleton className="h-24 sm:h-28 lg:h-32 rounded-xl shadow-smooth animate-slide-in-left" style={{'--index': 0} as any} />
            <Skeleton className="h-24 sm:h-28 lg:h-32 rounded-xl shadow-smooth animate-slide-up" style={{'--index': 1} as any} />
            <Skeleton className="h-24 sm:h-28 lg:h-32 rounded-xl shadow-smooth animate-slide-up" style={{'--index': 2} as any} />
            <Skeleton className="h-24 sm:h-28 lg:h-32 rounded-xl shadow-smooth animate-slide-in-right" style={{'--index': 3} as any} />
          </div>
          <Skeleton className="h-64 sm:h-80 lg:h-96 rounded-xl shadow-smooth animate-fade-in" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-2 sm:p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto animate-fade-in page-transition">
      <div className="animate-slide-up">
        <DashboardHeader
          title="Dashboard Admin"
          subtitle="Kelola pengguna dan monitor aktivitas platform"
        />
      </div>

      {/* Enhanced Stats Cards with responsive layout */}
      <div className="mb-4 sm:mb-6 lg:mb-8 animate-slide-up" style={{'--index': 1} as any}>
        <AdminStatsCards stats={stats} />
      </div>

      {/* Main Content with enhanced responsive design */}
      <div className="animate-slide-up" style={{'--index': 2} as any}>
        <div className="bg-card/80 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg border border-border/50 p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:shadow-xl">
          <Tabs defaultValue="analytics" className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Enhanced Responsive Tab List */}
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 bg-muted/50 p-1 sm:p-2 rounded-lg lg:rounded-xl shadow-inner">
              <TabsTrigger 
                value="analytics" 
                className="
                  flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium 
                  px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-md lg:rounded-lg
                  data-[state=active]:bg-background data-[state=active]:shadow-md
                  data-[state=active]:text-primary transition-all duration-200
                  hover:bg-background/50 hover-scale
                "
              >
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:hidden md:inline">Analytics</span>
                <span className="xs:hidden sm:inline md:hidden">Chart</span>
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="
                  flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium 
                  px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-md lg:rounded-lg
                  data-[state=active]:bg-background data-[state=active]:shadow-md
                  data-[state=active]:text-primary transition-all duration-200
                  hover:bg-background/50 hover-scale
                "
              >
                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:hidden md:inline">Produk</span>
                <span className="xs:hidden sm:inline md:hidden">Item</span>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="
                  flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium 
                  px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-md lg:rounded-lg
                  data-[state=active]:bg-background data-[state=active]:shadow-md
                  data-[state=active]:text-primary transition-all duration-200
                  hover:bg-background/50 hover-scale
                "
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:hidden md:inline">Users</span>
                <span className="xs:hidden sm:inline md:hidden">User</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="
                  flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium 
                  px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-md lg:rounded-lg
                  data-[state=active]:bg-background data-[state=active]:shadow-md
                  data-[state=active]:text-primary transition-all duration-200
                  hover:bg-background/50 hover-scale
                "
              >
                <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:hidden md:inline">AI</span>
                <span className="xs:hidden sm:inline md:hidden">Bot</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents with enhanced responsive animations */}
            <TabsContent value="analytics" className="animate-fade-in">
              <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border-border/50 shadow-xl rounded-xl lg:rounded-2xl transition-all duration-300 hover:shadow-2xl">
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
  );
}
