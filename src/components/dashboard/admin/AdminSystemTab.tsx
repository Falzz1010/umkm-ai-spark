
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { SystemHealthMonitor } from './SystemHealthMonitor';
import { useSystemHealth } from '@/hooks/useSystemHealth';

export function AdminSystemTab() {
  const { refresh } = useSystemHealth();

  const handleRefresh = async () => {
    await refresh();
  };

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border-border/50 shadow-xl rounded-xl lg:rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            System Health Monitoring
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs sm:text-sm">
            Monitor API performance, database metrics, and system status
          </CardDescription>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <SystemHealthMonitor />
      </CardContent>
    </Card>
  );
}
