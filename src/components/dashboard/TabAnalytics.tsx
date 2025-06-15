
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AnalyticsCharts } from './AnalyticsCharts';

interface TabAnalyticsProps {
  analyticsData: any;
}

export function TabAnalytics({ analyticsData }: TabAnalyticsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Analytics</CardTitle>
          <CardDescription>
            Analisis performa bisnis dan aktivitas penggunaan platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsCharts data={analyticsData} />
        </CardContent>
      </Card>
    </div>
  );
}
