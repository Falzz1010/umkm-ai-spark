
import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  data: Array<{ name: string; value: number }>;
  type: 'line' | 'area' | 'bar';
  color?: string;
  height?: number;
}

export function MiniChart({ data, type, color = '#3b82f6', height = 60 }: MiniChartProps) {
  const commonProps = {
    width: '100%',
    height: height,
    data: data
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              fill={color}
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <Bar dataKey="value" fill={color} />
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  );
}
