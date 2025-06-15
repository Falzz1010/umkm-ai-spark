
import React from "react";
import { Bar } from "recharts";
import { getChartColors } from "./chartUtils";

interface ChartBarsProps {
  isDark: boolean;
}

export const ChartBars: React.FC<ChartBarsProps> = ({ isDark }) => {
  const chartColors = getChartColors(isDark);

  return (
    <>
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
    </>
  );
};
