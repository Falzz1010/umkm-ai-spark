
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  Globe, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: any;
}

export function SystemHealthMonitor() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchMetrics = () => {
      // Simulate real-time metrics
      const newMetrics: SystemMetric[] = [
        {
          name: 'API Response Time',
          value: Math.random() * 200 + 50,
          unit: 'ms',
          status: 'healthy',
          trend: Math.random() > 0.5 ? 'up' : 'down',
          icon: Globe
        },
        {
          name: 'Database Performance',
          value: Math.random() * 30 + 70,
          unit: '%',
          status: Math.random() > 0.8 ? 'warning' : 'healthy',
          trend: 'stable',
          icon: Database
        },
        {
          name: 'Error Rate',
          value: Math.random() * 5,
          unit: '%',
          status: Math.random() > 0.9 ? 'critical' : 'healthy',
          trend: Math.random() > 0.7 ? 'down' : 'up',
          icon: AlertCircle
        },
        {
          name: 'Active Users',
          value: Math.floor(Math.random() * 1000 + 500),
          unit: 'users',
          status: 'healthy',
          trend: 'up',
          icon: Activity
        }
      ];

      setMetrics(newMetrics);
      setLastUpdate(new Date());
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': case 'critical': return AlertCircle;
      default: return Activity;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  const overallHealth = metrics.length > 0 ? 
    metrics.filter(m => m.status === 'healthy').length / metrics.length * 100 : 100;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">System Health Monitor</CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={overallHealth > 80 ? 'border-green-500 text-green-700' : 
                      overallHealth > 60 ? 'border-yellow-500 text-yellow-700' : 
                      'border-red-500 text-red-700'}
          >
            {overallHealth.toFixed(0)}% Healthy
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Health Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall System Health</span>
            <span className="font-medium">{overallHealth.toFixed(1)}%</span>
          </div>
          <Progress 
            value={overallHealth} 
            className="h-2"
          />
        </div>

        {/* Individual Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const StatusIcon = getStatusIcon(metric.status);
            const TrendIcon = getTrendIcon(metric.trend);
            const Icon = metric.icon;

            return (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{metric.name}</div>
                    <div className="text-lg font-bold">
                      {typeof metric.value === 'number' && metric.value % 1 !== 0 
                        ? metric.value.toFixed(1) 
                        : metric.value}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        {metric.unit}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendIcon className={`h-3 w-3 ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 
                    'text-gray-600'
                  }`} />
                  <StatusIcon className={`h-4 w-4 ${
                    metric.status === 'healthy' ? 'text-green-600' : 
                    metric.status === 'warning' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <div className="text-sm font-medium mb-2">Quick Actions</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              Refresh Metrics
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              View Logs
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              Alert Settings
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
