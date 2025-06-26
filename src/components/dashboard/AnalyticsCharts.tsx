
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
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      {/* Daily Activity Chart - Full width on all screens */}
      <Card className="w-full">
        <CardHeader className="pb-2 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Aktivitas Harian (7 Hari Terakhir)</CardTitle>
          <CardDescription className="text-sm">Trend pengguna, produk, dan penggunaan AI</CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ChartContainer config={chartConfig} className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyStats} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  tickMargin={5}
                />
                <YAxis 
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  width={30}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke={chartConfig.users.color} 
                  strokeWidth={2} 
                  name="Pengguna Baru"
                  dot={{ r: 3 }}
                  activeDot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="products" 
                  stroke={chartConfig.products.color} 
                  strokeWidth={2} 
                  name="Produk Baru"
                  dot={{ r: 3 }}
                  activeDot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="aiUsage" 
                  stroke={chartConfig.aiUsage.color} 
                  strokeWidth={2} 
                  name="Penggunaan AI"
                  dot={{ r: 3 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bottom Charts - Responsive grid: 1 col on mobile, 2 cols on tablet+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Category Distribution */}
        <Card className="w-full">
          <CardHeader className="pb-2 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Distribusi Kategori Produk</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Kategori produk paling populer</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryStats} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="category" 
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                    tickMargin={5}
                  />
                  <YAxis 
                    fontSize={9}
                    tick={{ fontSize: 9 }}
                    width={25}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill={chartConfig.products.color}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* AI Usage by Type */}
        <Card className="w-full">
          <CardHeader className="pb-2 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Penggunaan AI by Tipe</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Fitur AI yang paling sering digunakan</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Pie
                    data={data.aiTypeStats}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="count"
                    label={({ type, percent }) => 
                      percent > 0.05 ? `${type} ${(percent * 100).toFixed(0)}%` : ''
                    }
                    labelLine={false}
                    fontSize={10}
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
