
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Label } from "recharts";

type ChartData = {
  sale_date: string;
  total_omzet: number;
  total_laba: number;
};

export function SalesOmzetChart() {
  const { user } = useAuth();
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("daily_sales_summary")
      .select("sale_date,total_omzet,total_laba")
      .eq("user_id", user.id)
      .order("sale_date", { ascending: true })
      .then(({ data }) => {
        setData(
          (data || []).map((row) => ({
            ...row,
            total_omzet: Number(row.total_omzet || 0),
            total_laba: Number(row.total_laba || 0),
          }))
        );
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return <div className="py-6 text-sm text-muted-foreground">Memuat grafik omzet & laba...</div>;
  }

  if (data.length === 0) {
    return <div className="py-6 text-sm text-muted-foreground">Belum ada transaksi untuk grafik omzet/laba.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Line Omzet & Laba Harian</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 12 }}>
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
                offset={0}
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
            <Line
              type="monotone"
              dataKey="total_omzet"
              stroke="#22c55e"
              strokeWidth={3}
              activeDot={{ r: 7 }}
              name="Omzet"
            />
            <Line
              type="monotone"
              dataKey="total_laba"
              stroke="#facc15"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Laba"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
