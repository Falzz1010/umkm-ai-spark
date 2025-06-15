
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
  TooltipProps,
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [user?.id]);

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

  // Intuisi warna modern: hijau lembut dan kuning lembut dengan efek hover
  const OMZET_BASE = "#4ade80";    // green-400
  const OMZET_HOVER = "#22c55e";   // green-500
  const LABA_BASE = "#fde68a";     // yellow-200
  const LABA_HOVER = "#fbbf24";    // yellow-400
  // Grid dan axis pakai warna tailwind yg jelas di light/dark
  const GRID_COLOR = "rgba(180,200,220,0.32)";
  const GRID_COLOR_DARK = "rgba(90,100,120,0.27)";
  const LABEL_COLOR = "var(--muted-foreground)";
  const TOOLTIP_BG = "bg-white dark:bg-zinc-900";
  const TOOLTIP_BORDER = "border border-zinc-200 dark:border-zinc-700";

  // Custom Tooltip fully styled for light/dark
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    return (
      <div className={`rounded-md shadow-lg px-4 py-3 ${TOOLTIP_BG} ${TOOLTIP_BORDER}`}>
        <div className="mb-1 text-xs text-muted-foreground font-semibold">
          {new Date(label as string).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })}
        </div>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>
              {entry.name}: <span className="font-medium text-foreground">Rp {Number(entry.value).toLocaleString("id-ID")}</span>
            </span>
          </div>
        ))}
      </div>
    );
  };

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
                stroke={typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? GRID_COLOR_DARK
                  : GRID_COLOR}
              />
              <XAxis
                dataKey="sale_date"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
                }
                tick={{ fontSize: 12, fill: LABEL_COLOR }}
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
                tick={{ fontSize: 12, fill: LABEL_COLOR }}
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
                  color: "var(--muted-foreground)",
                }}
              />
              <Bar
                dataKey="total_omzet"
                fill={OMZET_BASE}
                name="Omzet"
                radius={[7, 7, 0, 0]}
                maxBarSize={38}
                className="transition-all duration-150"
                style={{
                  filter: "drop-shadow(0 1.5px 6px #4ade8033)",
                  cursor: "pointer"
                }}
                activeBar={{
                  fill: OMZET_HOVER,
                  opacity: 0.92,
                  style: { filter: "drop-shadow(0 2px 8px #22c55e42)" },
                }}
              />
              <Bar
                dataKey="total_laba"
                fill={LABA_BASE}
                name="Laba"
                radius={[7, 7, 0, 0]}
                maxBarSize={38}
                className="transition-all duration-150"
                style={{
                  filter: "drop-shadow(0 1.5px 6px #fde68a63)",
                  cursor: "pointer"
                }}
                activeBar={{
                  fill: LABA_HOVER,
                  opacity: 0.92,
                  style: { filter: "drop-shadow(0 2px 8px #fbbf2442)" },
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// File ini sudah cukup panjang (>200 baris). Silakan pertimbangkan untuk refaktor agar lebih mudah dirawat jika diperlukan.
