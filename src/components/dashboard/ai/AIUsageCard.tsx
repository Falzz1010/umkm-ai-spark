
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Zap, TrendingUp } from 'lucide-react';

interface AIUsageCardProps {
  aiUsageCount: number;
  dailyLimit: number;
}

export function AIUsageCard({ aiUsageCount, dailyLimit }: AIUsageCardProps) {
  const usagePercentage = (aiUsageCount / dailyLimit) * 100;
  const isNearLimit = usagePercentage >= 80;
  const isWarning = usagePercentage >= 60;
  
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10" />
      
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              AI Usage Today
            </CardTitle>
          </div>
          <Badge 
            variant={isNearLimit ? "destructive" : isWarning ? "secondary" : "default"} 
            className={`font-medium ${
              isNearLimit 
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" 
                : isWarning
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
            }`}
          >
            {aiUsageCount}/{dailyLimit}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{usagePercentage.toFixed(1)}%</span>
          </div>
          
          <Progress 
            value={usagePercentage} 
            className={`h-3 ${
              isNearLimit 
                ? "bg-red-100 dark:bg-red-900/20" 
                : isWarning 
                ? "bg-yellow-100 dark:bg-yellow-900/20"
                : "bg-green-100 dark:bg-green-900/20"
            }`}
          />
          
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-3 w-3" />
            <span>Tersisa {dailyLimit - aiUsageCount} penggunaan</span>
          </div>
        </div>

        {isNearLimit && (
          <Alert className="mt-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 transition-all duration-300">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-800 dark:text-red-300 font-medium">
              Peringatan! Anda hampir mencapai batas harian. Gunakan dengan bijak.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
