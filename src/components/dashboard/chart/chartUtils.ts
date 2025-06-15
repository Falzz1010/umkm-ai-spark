
export const getChartColors = (isDark: boolean) => ({
  omzetBase: isDark ? "#22c55e" : "#4ade80",
  omzetHover: isDark ? "#4ade80" : "#22c55e",
  labaBase: isDark ? "#fbbf24" : "#fde68a",
  labaHover: isDark ? "#fde68a" : "#fbbf24",
  gridColor: isDark ? "rgba(90,100,120,0.22)" : "rgba(180,200,220,0.19)",
  labelColor: isDark ? "rgba(235,238,245,0.85)" : "rgba(75,85,99,0.92)",
  legendColor: isDark ? "rgba(235,238,245,0.88)" : "rgba(71,85,105,0.94)",
});

export const getTooltipStyles = (isDark: boolean) => ({
  bg: isDark ? "bg-zinc-900" : "bg-white",
  border: isDark ? "border border-zinc-700" : "border border-zinc-200",
  text: isDark ? "text-zinc-100" : "text-zinc-900",
  subtle: isDark ? "text-zinc-400" : "text-zinc-500",
});

export const formatDateTick = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", { 
    day: "2-digit", 
    month: "short",
    year: window.innerWidth > 1024 ? "2-digit" : undefined 
  });
};

export const formatYAxisTick = (value: number) => {
  return window.innerWidth > 1024 
    ? 'Rp ' + Number(value).toLocaleString("id-ID")
    : 'Rp ' + (Number(value) / 1000).toFixed(0) + 'K';
};
