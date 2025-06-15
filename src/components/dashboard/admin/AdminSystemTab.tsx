
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity } from 'lucide-react';
import { SystemHealthMonitor } from './SystemHealthMonitor';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { useState } from 'react';

export function AdminSystemTab() {
  const { refresh } = useSystemHealth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    console.log('🔄 Manual refresh triggered from System tab');
    try {
      await refresh();
      console.log('✅ Manual refresh completed');
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border-border/50 shadow-xl rounded-xl lg:rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              System Health Monitoring
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs sm:text-sm">
              Real-time API performance, database metrics, and system status indicators
            </CardDescription>
          </div>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <SystemHealthMonitor />
      </CardContent>
    </Card>
  );
}
