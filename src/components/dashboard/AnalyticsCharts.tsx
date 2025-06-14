
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Activity Chart */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Aktivitas Harian (7 Hari Terakhir)</CardTitle>
          <CardDescription>Trend pengguna, produk, dan penggunaan AI</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke={chartConfig.users.color} 
                  strokeWidth={2} 
                  name="Pengguna Baru"
                />
                <Line 
                  type="monotone" 
                  dataKey="products" 
                  stroke={chartConfig.products.color} 
                  strokeWidth={2} 
                  name="Produk Baru"
                />
                <Line 
                  type="monotone" 
                  dataKey="aiUsage" 
                  stroke={chartConfig.aiUsage.color} 
                  strokeWidth={2} 
                  name="Penggunaan AI"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Kategori Produk</CardTitle>
          <CardDescription>Kategori produk paling populer</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill={chartConfig.products.color} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* AI Usage by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Penggunaan AI by Tipe</CardTitle>
          <CardDescription>Fitur AI yang paling sering digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.aiTypeStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
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
  );
}
