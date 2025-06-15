
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
      <div className="min-h-screen bg-background px-4 py-8 animate-fade-in flex items-center justify-center page-transition">
        <div className="w-full max-w-7xl space-y-8">
          <div className="space-y-4 animate-slide-up">
            <Skeleton className="h-12 w-64 shadow-smooth" />
            <Skeleton className="h-6 w-40 shadow-smooth" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            <Skeleton className="h-32 rounded-xl shadow-smooth animate-slide-in-left" style={{'--index': 0} as any} />
            <Skeleton className="h-32 rounded-xl shadow-smooth animate-slide-up" style={{'--index': 1} as any} />
            <Skeleton className="h-32 rounded-xl shadow-smooth animate-slide-up" style={{'--index': 2} as any} />
            <Skeleton className="h-32 rounded-xl shadow-smooth animate-slide-in-right" style={{'--index': 3} as any} />
          </div>
          <Skeleton className="h-96 rounded-xl shadow-smooth animate-fade-in" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 px-4 py-6 lg:p-8 max-w-7xl mx-auto animate-fade-in page-transition">
      <div className="animate-slide-up">
        <DashboardHeader
          title="Dashboard Admin"
          subtitle="Kelola pengguna dan monitor aktivitas platform"
        />
      </div>

      {/* Enhanced Stats Cards with stagger animation */}
      <div className="mb-8 animate-slide-up" style={{'--index': 1} as any}>
        <AdminStatsCards stats={stats} />
      </div>

      {/* Main Content with enhanced design */}
      <div className="animate-slide-up" style={{'--index': 2} as any}>
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border/50 p-6 transition-all duration-300 hover:shadow-xl">
          <Tabs defaultValue="analytics" className="space-y-6">
            {/* Enhanced Tab List */}
            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2 bg-muted/50 p-2 rounded-xl shadow-inner">
              <TabsTrigger 
                value="analytics" 
                className="
                  flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-lg
                  data-[state=active]:bg-background data-[state=active]:shadow-md
                  data-[state=active]:text-primary transition-all duration-200
                  hover:bg-background/50 hover-scale
                "
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="
                  flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-lg
                  data-[state=active]:bg-background data-[state=active]:shadow-md
                  data-[state=active]:text-primary transition-all duration-200
                  hover:bg-background/50 hover-scale
                "
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Produk</span>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="
                  flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-lg
                  data-[state=active]:bg-background data-[state=active]:shadow-md
                  data-[state=active]:text-primary transition-all duration-200
                  hover:bg-background/50 hover-scale
                "
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Pengguna</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="
                  flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-lg
                  data-[state=active]:bg-background data-[state=active]:shadow-md
                  data-[state=active]:text-primary transition-all duration-200
                  hover:bg-background/50 hover-scale
                "
              >
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">AI</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents with enhanced animations */}
            <TabsContent value="analytics" className="animate-fade-in">
              <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border-border/50 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        Analytics & Insights
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Visualisasi data dan tren aktivitas platform
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
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
