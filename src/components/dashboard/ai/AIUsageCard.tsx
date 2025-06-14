
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AIUsageCardProps {
  aiUsageCount: number;
  dailyLimit: number;
}

export function AIUsageCard({ aiUsageCount, dailyLimit }: AIUsageCardProps) {
  const usagePercentage = (aiUsageCount / dailyLimit) * 100;

  return (
    <Card className="border-orange-200 dark:border-orange-700 bg-white dark:bg-gray-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Penggunaan AI Hari Ini</CardTitle>
          <Badge variant={usagePercentage >= 80 ? "destructive" : "secondary"} className="dark:bg-gray-700 dark:text-gray-200">
            {aiUsageCount}/{dailyLimit}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={usagePercentage} className="h-2 bg-gray-200 dark:bg-gray-700" />
        {usagePercentage >= 80 && (
          <Alert className="mt-3 border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-950">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              Anda hampir mencapai batas harian. Tersisa {dailyLimit - aiUsageCount} penggunaan.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
