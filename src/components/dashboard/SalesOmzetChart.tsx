
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

  // Memoized chart colors
  const chartColors = useMemo(() => ({
    omzetBase: isDark ? "#22c55e" : "#4ade80",
    omzetHover: isDark ? "#4ade80" : "#22c55e",
    labaBase: isDark ? "#fbbf24" : "#fde68a",
    labaHover: isDark ? "#fde68a" : "#fbbf24",
    gridColor: isDark ? "rgba(90,100,120,0.22)" : "rgba(180,200,220,0.19)",
    labelColor: isDark ? "rgba(235,238,245,0.85)" : "rgba(75,85,99,0.92)",
    legendColor: isDark ? "rgba(235,238,245,0.88)" : "rgba(71,85,105,0.94)",
  }), [isDark]);

  // Memoized tooltip styles
  const tooltipStyles = useMemo(() => ({
    bg: isDark ? "bg-zinc-900" : "bg-white",
    border: isDark ? "border border-zinc-700" : "border border-zinc-200",
    text: isDark ? "text-zinc-100" : "text-zinc-900",
    subtle: isDark ? "text-zinc-400" : "text-zinc-500",
  }), [isDark]);

  // Custom Tooltip component
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    
    return (
      <div className={`rounded-md shadow-lg px-4 py-3 ${tooltipStyles.bg} ${tooltipStyles.border}`}>
        <div className={`mb-1 text-xs font-semibold ${tooltipStyles.subtle}`}>
          {new Date(label as string).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
        {payload.map((entry, idx) => (
          <div key={idx} className={`flex items-center gap-2 text-sm ${tooltipStyles.text}`}>
            <span 
              className="inline-block w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            <span>
              {entry.name}: 
              <span className={`font-medium ${tooltipStyles.text}`}>
                {" "}Rp {Number(entry.value).toLocaleString("id-ID")}
              </span>
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
          <CardTitle className="text-base sm:text-lg font-semibold text-primary">
            Grafik Omzet & Laba Harian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-sm text-muted-foreground">
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
          <CardTitle className="text-base sm:text-lg font-semibold text-primary">
            Grafik Omzet & Laba Harian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-sm text-muted-foreground">
            Belum ada transaksi untuk grafik omzet/laba.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border bg-white dark:bg-card transition-colors">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold text-primary">
          Grafik Omzet & Laba Harian
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="w-full h-[260px] sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 18, right: 25, left: 2, bottom: 32 }}
              barGap={8}
              barCategoryGap="22%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.gridColor}
              />
              <XAxis
                dataKey="sale_date"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
                }
                tick={{ fontSize: 12, fill: chartColors.labelColor }}
                angle={-15}
                textAnchor="end"
                height={44}
                interval="preserveStartEnd"
                minTickGap={6}
              >
                <Label
                  value="Tanggal"
                  offset={-12}
                  position="insideBottom"
                  className="fill-muted-foreground font-semibold"
                  fontSize={13}
                />
              </XAxis>
              <YAxis
                tickFormatter={v => 'Rp ' + Number(v).toLocaleString("id-ID")}
                tick={{ fontSize: 12, fill: chartColors.labelColor }}
                width={74}
                axisLine={false}
                tickLine={false}
              >
                <Label
                  value="Omzet & Laba (Rp)"
                  angle={-90}
                  offset={-8}
                  position="insideLeft"
                  className="fill-muted-foreground font-semibold"
                  fontSize={13}
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip
                content={CustomTooltip}
                cursor={{ fill: "var(--accent)", opacity: 0.07 }}
                wrapperClassName="z-50"
              />
              <Legend
                verticalAlign="top"
                align="center"
                iconType="circle"
                height={32}
                wrapperStyle={{
                  top: 0,
                  paddingBottom: 4,
                  fontSize: 13,
                  color: chartColors.legendColor,
                  fontWeight: 500,
                  letterSpacing: ".04em",
                }}
              />
              <Bar
                dataKey="total_omzet"
                fill={chartColors.omzetBase}
                name="Omzet"
                radius={[7, 7, 0, 0]}
                maxBarSize={38}
                className="transition-all duration-150"
                style={{
                  filter: isDark
                    ? "drop-shadow(0 1.5px 6px #22c55e28)"
                    : "drop-shadow(0 1.5px 6px #4ade8033)",
                  cursor: "pointer",
                }}
                activeBar={{
                  fill: chartColors.omzetHover,
                  opacity: 0.94,
                }}
              />
              <Bar
                dataKey="total_laba"
                fill={chartColors.labaBase}
                name="Laba"
                radius={[7, 7, 0, 0]}
                maxBarSize={38}
                className="transition-all duration-150"
                style={{
                  filter: isDark
                    ? "drop-shadow(0 1.5px 6px #fbbf243c)"
                    : "drop-shadow(0 1.5px 6px #fde68a59)",
                  cursor: "pointer",
                }}
                activeBar={{
                  fill: chartColors.labaHover,
                  opacity: 0.93,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
