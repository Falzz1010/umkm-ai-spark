
import * as React from "react"
import * as RechartsPrimitive from "recharts"

// Export chart context and hooks
export type { ChartConfig } from "./chart/ChartContext"
export { useChart } from "./chart/ChartContext"

// Export chart components
export { ChartContainer } from "./chart/ChartContainer"
export { ChartStyle } from "./chart/ChartStyle"
export { ChartTooltipContent } from "./chart/ChartTooltipContent"
export { ChartLegend, ChartLegendContent } from "./chart/ChartLegend"

// Re-export recharts tooltip for compatibility
export const ChartTooltip = RechartsPrimitive.Tooltip
