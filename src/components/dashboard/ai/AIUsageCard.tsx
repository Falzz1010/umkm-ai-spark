
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Zap } from 'lucide-react';

interface AIUsageCardProps {
  aiUsageCount: number;
  dailyLimit: number;
}

export function AIUsageCard({ aiUsageCount, dailyLimit }: AIUsageCardProps) {
  const usagePercentage = (aiUsageCount / dailyLimit) * 100;
  const isNearLimit = usagePercentage >= 80;
  const isWarning = usagePercentage >= 60;
  
  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Penggunaan AI Hari Ini
            </CardTitle>
          </div>
          <Badge 
            variant={isNearLimit ? "destructive" : isWarning ? "secondary" : "default"} 
            className="font-medium"
          >
            {aiUsageCount}/{dailyLimit}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{usagePercentage.toFixed(1)}%</span>
          </div>
          
          <Progress value={usagePercentage} className="h-2" />
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Tersisa {dailyLimit - aiUsageCount} penggunaan
          </div>
        </div>

        {isNearLimit && (
          <Alert className="mt-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              Peringatan! Anda hampir mencapai batas harian.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
