
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Database, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useSystemHealth } from '@/hooks/useSystemHealth';

export function SystemHealthMonitor() {
  const { healthData, loading } = useSystemHealth();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
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
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Overview
          </CardTitle>
          <CardDescription>Real-time system performance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(healthData.overallStatus)}
              <span className="font-medium">
                {healthData.overallStatus === 'healthy' ? 'All Systems Operational' : 
                 healthData.overallStatus === 'warning' ? 'Some Issues Detected' : 
                 'System Issues'}
              </span>
            </div>
            <Badge variant={healthData.overallStatus === 'healthy' ? 'default' : 'destructive'}>
              {healthData.overallStatus.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* API Response Times */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              API Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{healthData.apiResponseTime}ms</span>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(healthData.apiStatus)}`}></div>
              </div>
              <Progress value={healthData.apiPerformance} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Avg: {healthData.avgResponseTime}ms
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Database Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{healthData.dbConnectionTime}ms</span>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(healthData.dbStatus)}`}></div>
              </div>
              <Progress value={healthData.dbPerformance} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Connections: {healthData.activeConnections}/{healthData.maxConnections}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{healthData.errorRate}%</span>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(healthData.errorStatus)}`}></div>
              </div>
              <Progress value={healthData.errorRate} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Last hour: {healthData.recentErrors} errors
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Load */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              System Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{healthData.systemLoad}%</span>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(healthData.loadStatus)}`}></div>
              </div>
              <Progress value={healthData.systemLoad} className="h-1" />
              <p className="text-xs text-muted-foreground">
                Memory: {healthData.memoryUsage}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent System Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthData.recentEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {getStatusIcon(event.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.message}</p>
                  <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
