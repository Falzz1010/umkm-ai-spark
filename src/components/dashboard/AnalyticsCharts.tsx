
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  dailyStats: Array<{ date: string; users: number; products: number; aiUsage: number }>;
  categoryStats: Array<{ category: string; count: number }>;
  aiTypeStats: Array<{ type: string; count: number; color: string }>;
}

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const chartConfig = {
    users: { label: "Users", color: "#3b82f6" },
    products: { label: "Products", color: "#10b981" },
    aiUsage: { label: "AI Usage", color: "#f59e0b" },
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Daily Activity Chart - Full width on all screens */}
      <Card className="w-full shadow-smooth card-hover">
        <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Aktivitas Harian (7 Hari Terakhir)</CardTitle>
          <CardDescription className="text-sm">Trend pengguna, produk, dan penggunaan AI</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <ChartContainer config={chartConfig} className="h-64 sm:h-72 lg:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyStats} margin={{ top: 10, right: 15, left: 5, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis 
                  dataKey="date" 
                  fontSize={11}
                  tick={{ fontSize: 11 }}
                  tickMargin={8}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  fontSize={11}
                  tick={{ fontSize: 11 }}
                  width={35}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke={chartConfig.users.color} 
                  strokeWidth={3} 
                  name="Pengguna Baru"
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="products" 
                  stroke={chartConfig.products.color} 
                  strokeWidth={3} 
                  name="Produk Baru"
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="aiUsage" 
                  stroke={chartConfig.aiUsage.color} 
                  strokeWidth={3} 
                  name="Penggunaan AI"
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bottom Charts - Responsive grid: 1 col on mobile, 2 cols on desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 w-full">
        {/* Category Distribution */}
        <Card className="w-full shadow-smooth card-hover">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <CardTitle className="text-sm sm:text-base">Distribusi Kategori Produk</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Kategori produk paling populer</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ChartContainer config={chartConfig} className="h-48 sm:h-56 lg:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryStats} margin={{ top: 10, right: 10, left: 5, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis 
                    dataKey="category" 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={55}
                    tickMargin={8}
                    interval={0}
                  />
                  <YAxis 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    width={30}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill={chartConfig.products.color}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* AI Usage by Type */}
        <Card className="w-full shadow-smooth card-hover">
          <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <CardTitle className="text-sm sm:text-base">Penggunaan AI by Tipe</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Fitur AI yang paling sering digunakan</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ChartContainer config={chartConfig} className="h-48 sm:h-56 lg:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={data.aiTypeStats}
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    innerRadius="30%"
                    fill="#8884d8"
                    dataKey="count"
                    label={({ type, percent }) => 
                      percent > 0.08 ? `${type}` : ''
                    }
                    labelLine={false}
                    fontSize={11}
                  >
                    {data.aiTypeStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
