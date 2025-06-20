
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsCharts } from './AnalyticsCharts';
import { AIAnalyticsSection } from './analytics/AIAnalyticsSection';
import { Product } from '@/types/database';

interface TabAnalyticsProps {
  analyticsData: any;
  products: Product[];
}

export function TabAnalytics({ analyticsData, products }: TabAnalyticsProps) {
  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">
            📊 Analytics Charts
          </TabsTrigger>
          <TabsTrigger value="ai-insights">
            🤖 AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="mt-6">
          <AnalyticsCharts data={analyticsData} />
        </TabsContent>

        <TabsContent value="ai-insights" className="mt-6">
          <AIAnalyticsSection products={products} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
