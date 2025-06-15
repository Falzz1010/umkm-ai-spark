
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

  // Fetch the data
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

  // Initial load + refresh on user change
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [user?.id]);

  // Realtime subscription (auto refresh chart)
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
          // On any changes, refresh chart
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  if (loading) {
    return <div className="py-6 text-sm text-muted-foreground">Memuat grafik omzet & laba...</div>;
  }

  if (data.length === 0) {
    return <div className="py-6 text-sm text-muted-foreground">Belum ada transaksi untuk grafik omzet/laba.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Bar Omzet & Laba Harian</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 32, left: 0, bottom: 24 }}
            barGap={4}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="sale_date"
              tickFormatter={(d) =>
                new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
              }
              angle={-15}
              textAnchor="end"
              height={48}
            >
              <Label value="Tanggal" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label
                value="Rp"
                position="insideTopLeft"
                offset={-8}
                angle={-90}
                style={{ textAnchor: "middle" }}
                className="fill-muted-foreground"
              />
            </YAxis>
            <Tooltip formatter={(value: number) => "Rp " + value.toLocaleString("id-ID")} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 10 }}
            />
            <Bar
              dataKey="total_omzet"
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
              name="Omzet"
              maxBarSize={28}
            />
            <Bar
              dataKey="total_laba"
              fill="#facc15"
              radius={[6, 6, 0, 0]}
              name="Laba"
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
