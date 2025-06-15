
import React from "react";
import { TooltipProps } from "recharts";
import { getTooltipStyles } from "./chartUtils";

interface ChartTooltipProps extends TooltipProps<number, string> {
  isDark: boolean;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ 
  active, 
  payload, 
  label, 
  isDark 
}) => {
  const tooltipStyles = getTooltipStyles(isDark);
  
  if (!active || !payload || payload.length === 0) return null;
  
  return (
    <div className={`rounded-lg shadow-xl px-5 py-4 ${tooltipStyles.bg} ${tooltipStyles.border} min-w-[200px]`}>
      <div className={`mb-2 text-sm font-semibold ${tooltipStyles.subtle}`}>
        {new Date(label as string).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </div>
      {payload.map((entry, idx) => (
        <div key={idx} className={`flex items-center justify-between gap-4 text-sm ${tooltipStyles.text} mb-1`}>
          <div className="flex items-center gap-2">
            <span 
              className="inline-block w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            <span>{entry.name}:</span>
          </div>
          <span className={`font-bold ${tooltipStyles.text}`}>
            Rp {Number(entry.value).toLocaleString("id-ID")}
          </span>
        </div>
      ))}
    </div>
  );
};
