
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Database, AlertTriangle, CheckCircle, Clock, TrendingUp, Wifi, RefreshCw } from 'lucide-react';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { useEffect, useState } from 'react';

export function SystemHealthMonitor() {
  const { healthData, loading } = useSystemHealth();
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading System Health...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Overall Status with Real-time Connection Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Overview
            <div className="ml-auto flex items-center gap-2">
              <Wifi className={`h-4 w-4 ${connectionStatus === 'online' ? 'text-green-600' : 'text-red-600'}`} />
              <span className="text-xs text-muted-foreground">
                {connectionStatus === 'online' ? 'Live' : 'Offline'}
              </span>
            </div>
          </CardTitle>
          <CardDescription>
            Real-time system performance monitoring - Last updated: {healthData.lastUpdated}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(healthData.overallStatus)}
              <span className="font-medium">
                {healthData.overallStatus === 'healthy' ? 'All Systems Operational' : 
                 healthData.overallStatus === 'warning' ? 'Some Issues Detected' : 
                 'System Issues Detected'}
              </span>
            </div>
            <Badge variant={healthData.overallStatus === 'healthy' ? 'default' : 'destructive'}>
              {healthData.overallStatus.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* API Response Times - Real-time */}
        <Card className="relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              API Response
              <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(healthData.apiStatus)}`}></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{healthData.apiResponseTime}ms</span>
                <span className="text-xs text-muted-foreground">LIVE</span>
              </div>
              <Progress value={healthData.apiPerformance} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Avg: {healthData.avgResponseTime}ms | Target: &lt;150ms
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Database Performance - Real-time */}
        <Card className="relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
              <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(healthData.dbStatus)}`}></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{healthData.dbConnectionTime}ms</span>
                <span className="text-xs text-muted-foreground">LIVE</span>
              </div>
              <Progress value={healthData.dbPerformance} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Connections: {healthData.activeConnections}/{healthData.maxConnections}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Error Rate - Real-time */}
        <Card className="relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Error Rate
              <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(healthData.errorStatus)}`}></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{healthData.errorRate}%</span>
                <span className="text-xs text-muted-foreground">LIVE</span>
              </div>
              <Progress value={healthData.errorRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Last hour: {healthData.recentErrors} errors | Target: &lt;1%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Load - Real-time */}
        <Card className="relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              System Load
              <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(healthData.loadStatus)}`}></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{healthData.systemLoad}%</span>
                <span className="text-xs text-muted-foreground">LIVE</span>
              </div>
              <Progress value={healthData.systemLoad} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Memory: {healthData.memoryUsage}% | Target: &lt;70%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events - Real-time Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Recent System Events
            <span className="text-xs font-normal text-muted-foreground">Auto-updating every 10s</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthData.recentEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border-l-2 border-l-transparent data-[type=error]:border-l-red-500 data-[type=warning]:border-l-yellow-500 data-[type=healthy]:border-l-green-500" data-type={event.type}>
                {getStatusIcon(event.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.message}</p>
                  <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                </div>
                {index === 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Latest
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
