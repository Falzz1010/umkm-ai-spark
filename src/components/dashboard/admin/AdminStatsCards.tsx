
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, TrendingUp, Bot } from 'lucide-react';

interface AdminStatsCardsProps {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalAIGenerations: number;
    activeProducts: number;
  };
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const statsData = [
    {
      title: "Total Pengguna",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      iconColor: "text-blue-600",
      textColor: "text-blue-700 dark:text-blue-300",
      change: "+12%",
      changeColor: "text-green-600"
    },
    {
      title: "Total Produk",
      value: stats.totalProducts,
      icon: Package,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
      iconColor: "text-green-600",
      textColor: "text-green-700 dark:text-green-300",
      change: "+8%",
      changeColor: "text-green-600"
    },
    {
      title: "Produk Aktif",
      value: stats.activeProducts,
      icon: TrendingUp,
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-100 dark:from-yellow-950 dark:to-orange-900",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-700 dark:text-yellow-300",
      change: "+5%",
      changeColor: "text-green-600"
    },
    {
      title: "AI Generations",
      value: stats.totalAIGenerations,
      icon: Bot,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900",
      iconColor: "text-purple-600",
      textColor: "text-purple-700 dark:text-purple-300",
      change: "+24%",
      changeColor: "text-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 stagger-children">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={stat.title}
            className={`
              bg-gradient-to-br ${stat.bgGradient} 
              border-0 shadow-lg hover:shadow-xl 
              transition-all duration-300 
              hover:scale-105 hover:-translate-y-1
              card-hover group cursor-pointer
              animate-slide-up
            `}
            style={{'--index': index} as any}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.title}
              </CardTitle>
              <div className={`
                p-2 rounded-lg bg-background/20 backdrop-blur-sm
                group-hover:bg-background/40 transition-all duration-200
                group-hover:scale-110
              `}>
                <IconComponent className={`h-4 w-4 ${stat.iconColor} group-hover:scale-110 transition-transform`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl lg:text-3xl font-bold ${stat.textColor} group-hover:scale-105 transition-transform`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs font-medium ${stat.changeColor}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">vs bulan lalu</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
