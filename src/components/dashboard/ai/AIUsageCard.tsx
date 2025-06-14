
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
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Penggunaan AI Hari Ini</CardTitle>
          <Badge variant={usagePercentage >= 80 ? "destructive" : "secondary"}>
            {aiUsageCount}/{dailyLimit}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={usagePercentage} className="h-2" />
        {usagePercentage >= 80 && (
          <Alert className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Anda hampir mencapai batas harian. Tersisa {dailyLimit - aiUsageCount} penggunaan.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
