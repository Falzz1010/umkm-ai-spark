
import { useEffect, useRef } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

/**
 * MiniTrendChart 
 * - Visual cepat trend data (misal: omzet, laba, jumlah produk)
 * - Otomatis re-render & animasi ketika data berubah
 */
interface MiniTrendChartProps {
  data: Array<{ x: string | number; y: number }>;
  color?: string;
  height?: number;
  animate?: boolean; // default: true
}

export function MiniTrendChart({
  data,
  color = "#059669",
  height = 40,
  animate = true
}: MiniTrendChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  // Optional: BounceIn ketika data berubah
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.classList.remove("animate-bounce-subtle");
      // Force reflow to restart animation
      void chartRef.current.offsetWidth;
      chartRef.current.classList.add("animate-bounce-subtle");
      setTimeout(() => {
        chartRef.current?.classList.remove("animate-bounce-subtle");
      }, 450);
    }
  }, [data]);

  if (!data || data.length <= 1) return null;

  return (
    <div
      // tailwind hover-scale + bounce on new data
      ref={chartRef}
      className="w-full h-[40px] mt-3 px-0.5 pointer-events-none select-none transition-all duration-400 will-change-transform"
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
            isAnimationActive={animate}
            animationDuration={400}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
