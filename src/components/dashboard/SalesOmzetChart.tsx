
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DailySalesData } from "@/types/sales";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
  TooltipProps,
} from "recharts";

export function SalesOmzetChart() {
  const { user } = useAuth();
  const [data, setData] = useState<DailySalesData[]>([]);
  const [loading, setLoading] = useState(true);

  // Theme detection with memoization
  const isDark = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  }, []);

  // Memoized fetch function
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    console.log('Fetching sales chart data for user:', user.id);
    
    try {
      const { data: salesData, error } = await supabase
        .from("daily_sales_summary")
        .select("sale_date,total_omzet,total_laba")
        .eq("user_id", user.id)
        .order("sale_date", { ascending: true });
      
      if (error) {
        console.error('Error fetching chart data:', error);
        return;
      }

      console.log('Chart data fetched:', salesData?.length || 0, 'records');
      setData(
        (salesData || []).map((row) => ({
          sale_date: row.sale_date,
          total_omzet: Number(row.total_omzet || 0),
          total_laba: Number(row.total_laba || 0),
        }))
      );
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  // Real-time subscription with debounced fetch
  useRealtimeSubscription([
    {
      table: 'sales_transactions',
      event: '*',
      filter: user ? `user_id=eq.${user.id}` : '',
      callback: () => {
        // Debounce the fetch to avoid excessive calls
        setTimeout(() => {
          fetchData();
        }, 500);
      }
    }
  ], [user?.id]);

  // Enhanced chart colors for better desktop display
  const chartColors = useMemo(() => ({
    omzetBase: isDark ? "#22c55e" : "#4ade80",
    omzetHover: isDark ? "#4ade80" : "#22c55e",
    labaBase: isDark ? "#fbbf24" : "#fde68a",
    labaHover: isDark ? "#fde68a" : "#fbbf24",
    gridColor: isDark ? "rgba(90,100,120,0.22)" : "rgba(180,200,220,0.19)",
    labelColor: isDark ? "rgba(235,238,245,0.85)" : "rgba(75,85,99,0.92)",
    legendColor: isDark ? "rgba(235,238,245,0.88)" : "rgba(71,85,105,0.94)",
  }), [isDark]);

  // Enhanced tooltip styles for desktop
  const tooltipStyles = useMemo(() => ({
    bg: isDark ? "bg-zinc-900" : "bg-white",
    border: isDark ? "border border-zinc-700" : "border border-zinc-200",
    text: isDark ? "text-zinc-100" : "text-zinc-900",
    subtle: isDark ? "text-zinc-400" : "text-zinc-500",
  }), [isDark]);

  // Enhanced Custom Tooltip component with better desktop formatting
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    
    return (
      <div className={`rounded-lg shadow-xl px-5 py-4 ${tooltipStyles.bg} ${tooltipStyles.border} min-w-[200px]`}>
        <div className={`mb-2 text-sm font-semibold ${tooltipStyles.subtle}`}>
          {new Date(label as string).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
        {payload.map((entry, idx) => (
          <div key={idx} className={`flex items-center justify-between gap-4 text-sm ${tooltipStyles.text} mb-1`}>
            <div className="flex items-center gap-2">
              <span 
                className="inline-block w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }} 
              />
              <span>{entry.name}:</span>
            </div>
            <span className={`font-bold ${tooltipStyles.text}`}>
              Rp {Number(entry.value).toLocaleString("id-ID")}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="shadow-lg border bg-white dark:bg-card transition-colors">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl font-semibold text-primary">
            Grafik Omzet & Laba Harian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            Memuat grafik omzet & laba...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="shadow-lg border bg-white dark:bg-card transition-colors">
        <CardHeader>
          <CardTitle className="text-lg lg:text-xl font-semibold text-primary">
            Grafik Omzet & Laba Harian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            Belum ada transaksi untuk grafik omzet/laba.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border bg-white dark:bg-card transition-colors">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl font-semibold text-primary">
          Grafik Omzet & Laba Harian
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="w-full h-[320px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barGap={12}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.gridColor}
                opacity={0.7}
              />
              <XAxis
                dataKey="sale_date"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString("id-ID", { 
                    day: "2-digit", 
                    month: "short",
                    year: window.innerWidth > 1024 ? "2-digit" : undefined 
                  })
                }
                tick={{ fontSize: window.innerWidth > 1024 ? 13 : 12, fill: chartColors.labelColor }}
                angle={window.innerWidth > 1024 ? -15 : -25}
                textAnchor="end"
                height={50}
                interval="preserveStartEnd"
                minTickGap={8}
              >
                <Label
                  value="Tanggal"
                  offset={-15}
                  position="insideBottom"
                  className="fill-muted-foreground font-semibold"
                  fontSize={14}
                />
              </XAxis>
              <YAxis
                tickFormatter={v => window.innerWidth > 1024 
                  ? 'Rp ' + Number(v).toLocaleString("id-ID")
                  : 'Rp ' + (Number(v) / 1000).toFixed(0) + 'K'
                }
                tick={{ fontSize: window.innerWidth > 1024 ? 13 : 12, fill: chartColors.labelColor }}
                width={window.innerWidth > 1024 ? 85 : 70}
                axisLine={false}
                tickLine={false}
              >
                <Label
                  value={window.innerWidth > 1024 ? "Omzet & Laba (Rp)" : "Nilai (Rp)"}
                  angle={-90}
                  offset={-10}
                  position="insideLeft"
                  className="fill-muted-foreground font-semibold"
                  fontSize={14}
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip
                content={CustomTooltip}
                cursor={{ fill: "var(--accent)", opacity: 0.1 }}
                wrapperClassName="z-50"
              />
              <Legend
                verticalAlign="top"
                align="center"
                iconType="circle"
                height={36}
                wrapperStyle={{
                  top: 0,
                  paddingBottom: 8,
                  fontSize: window.innerWidth > 1024 ? 14 : 13,
                  color: chartColors.legendColor,
                  fontWeight: 500,
                  letterSpacing: ".05em",
                }}
              />
              <Bar
                dataKey="total_omzet"
                fill={chartColors.omzetBase}
                name="Omzet"
                radius={[8, 8, 0, 0]}
                maxBarSize={window.innerWidth > 1024 ? 45 : 35}
                className="transition-all duration-200"
                style={{
                  filter: isDark
                    ? "drop-shadow(0 2px 8px #22c55e30)"
                    : "drop-shadow(0 2px 8px #4ade8035)",
                  cursor: "pointer",
                }}
                activeBar={{
                  fill: chartColors.omzetHover,
                  opacity: 0.95,
                }}
              />
              <Bar
                dataKey="total_laba"
                fill={chartColors.labaBase}
                name="Laba"
                radius={[8, 8, 0, 0]}
                maxBarSize={window.innerWidth > 1024 ? 45 : 35}
                className="transition-all duration-200"
                style={{
                  filter: isDark
                    ? "drop-shadow(0 2px 8px #fbbf2440)"
                    : "drop-shadow(0 2px 8px #fde68a60)",
                  cursor: "pointer",
                }}
                activeBar={{
                  fill: chartColors.labaHover,
                  opacity: 0.94,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
