
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MiniTrendChartProps {
  data: Array<{ x: string | number; y: number }>;
  color?: string;
  height?: number;
}

export function MiniTrendChart({ data, color = "#059669", height = 40 }: MiniTrendChartProps) {
  if (!data || data.length <= 1) return null;
  return (
    <div className="w-full h-[40px] mt-3 px-0.5 pointer-events-none select-none">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <Line 
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
