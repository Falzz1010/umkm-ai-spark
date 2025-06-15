
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
} from "recharts";

type ChartData = {
  sale_date: string;
  total_omzet: number;
  total_laba: number;
};

export function SalesOmzetChart() {
  const { user } = useAuth();
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("daily_sales_summary")
      .select("sale_date,total_omzet,total_laba")
      .eq("user_id", user.id)
      .order("sale_date", { ascending: true });
    setData(
      (data || []).map((row) => ({
        ...row,
        total_omzet: Number(row.total_omzet || 0),
        total_laba: Number(row.total_laba || 0),
      }))
    );
    setLoading(false);
  };

  // Auto fetch initial and when user id changes
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [user?.id]);

  // Real-time auto update
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("public:daily_sales_summary")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "daily_sales_summary",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="py-6 text-sm text-muted-foreground">
        Memuat grafik omzet & laba...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-6 text-sm text-muted-foreground">
        Belum ada transaksi untuk grafik omzet/laba.
      </div>
    );
  }

  // Custom Tooltip for better UX
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    return (
      <div className="rounded-md shadow-sm bg-background p-3 border border-muted">
        <div className="mb-1 text-xs text-muted-foreground font-semibold">
          {new Date(label).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
        </div>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {entry.name}: <span className="font-medium text-foreground">Rp {Number(entry.value).toLocaleString("id-ID")}</span>
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Grafik Omzet & Laba Harian</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="w-full h-[260px] sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 18, right: 30, left: 2, bottom: 36 }}
              barGap={8}
              barCategoryGap="18%"
            >
              <CartesianGrid strokeDasharray="2 4" stroke="#e5e7eb" className="dark:stroke-[#333]" />
              <XAxis
                dataKey="sale_date"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
                }
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                angle={-15}
                textAnchor="end"
                height={48}
                interval="preserveStartEnd"
                minTickGap={6}
              >
                <Label
                  value="Tanggal"
                  offset={-16}
                  position="insideBottom"
                  className="fill-muted-foreground"
                  fontSize={13}
                />
              </XAxis>
              <YAxis
                tickFormatter={v => 'Rp ' + Number(v).toLocaleString("id-ID")}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                width={70}
              >
                <Label
                  value="Omzet & Laba (Rp)"
                  angle={-90}
                  offset={-8}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                  className="fill-muted-foreground"
                  fontSize={13}
                />
              </YAxis>
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: "var(--accent)", opacity: 0.06 }} 
              />
              <Legend
                verticalAlign="top"
                align="center"
                iconType="circle"
                height={36}
                wrapperStyle={{
                  paddingBottom: 8,
                  fontSize: 13,
                  color: "var(--muted-foreground)",
                }}
              />
              <Bar
                dataKey="total_omzet"
                fill="#34d399"
                name="Omzet"
                radius={[7, 7, 0, 0]}
                maxBarSize={32}
                className="transition-all duration-150"
                style={{ filter: "drop-shadow(0 2px 6px #34d39933)" }}
                // highlight on hover using recharts style prop
                activeBar={{ fill: "#059669" }}
              />
              <Bar
                dataKey="total_laba"
                fill="#fde68a"
                name="Laba"
                radius={[7, 7, 0, 0]}
                maxBarSize={32}
                className="transition-all duration-150"
                style={{ filter: "drop-shadow(0 2px 6px #fde68a33)" }}
                activeBar={{ fill: "#fbbf24" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
