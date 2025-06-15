
import React from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { getChartColors, formatDateTick, formatYAxisTick } from "./chartUtils";

interface ChartConfigProps {
  isDark: boolean;
}

export const ChartConfig: React.FC<ChartConfigProps> = ({ isDark }) => {
  const chartColors = getChartColors(isDark);

  return (
    <>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke={chartColors.gridColor}
        opacity={0.7}
      />
      <XAxis
        dataKey="sale_date"
        tickFormatter={formatDateTick}
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
        tickFormatter={formatYAxisTick}
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
        content={(props) => <ChartTooltip {...props} isDark={isDark} />}
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
    </>
  );
};
