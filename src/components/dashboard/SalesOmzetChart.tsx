
import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useChartData } from "@/hooks/useChartData";
import {
  BarChart,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig } from "./chart/ChartConfig";
import { ChartBars } from "./chart/ChartBars";

export function SalesOmzetChart() {
  const { data, loading } = useChartData();

  const isDark = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  }, []);

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
              <ChartConfig isDark={isDark} />
              <ChartBars isDark={isDark} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
