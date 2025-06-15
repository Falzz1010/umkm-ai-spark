
import { useState, useEffect } from 'react';

interface SystemEvent {
  type: 'healthy' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

interface SystemHealthData {
  overallStatus: 'healthy' | 'warning' | 'error';
  apiResponseTime: number;
  apiStatus: 'healthy' | 'warning' | 'error';
  apiPerformance: number;
  avgResponseTime: number;
  dbConnectionTime: number;
  dbStatus: 'healthy' | 'warning' | 'error';
  dbPerformance: number;
  activeConnections: number;
  maxConnections: number;
  errorRate: number;
  errorStatus: 'healthy' | 'warning' | 'error';
  recentErrors: number;
  systemLoad: number;
  loadStatus: 'healthy' | 'warning' | 'error';
  memoryUsage: number;
  recentEvents: SystemEvent[];
}

export function useSystemHealth() {
  const [healthData, setHealthData] = useState<SystemHealthData>({
    overallStatus: 'healthy',
    apiResponseTime: 0,
    apiStatus: 'healthy',
    apiPerformance: 0,
    avgResponseTime: 0,
    dbConnectionTime: 0,
    dbStatus: 'healthy',
    dbPerformance: 0,
    activeConnections: 0,
    maxConnections: 100,
    errorRate: 0,
    errorStatus: 'healthy',
    recentErrors: 0,
    systemLoad: 0,
    loadStatus: 'healthy',
    memoryUsage: 0,
    recentEvents: []
  });
  const [loading, setLoading] = useState(true);

  const generateRealisticMetrics = (): SystemHealthData => {
    const apiResponseTime = Math.floor(Math.random() * 200) + 50; // 50-250ms
    const dbConnectionTime = Math.floor(Math.random() * 50) + 10; // 10-60ms
    const errorRate = Math.random() * 5; // 0-5%
    const systemLoad = Math.floor(Math.random() * 100); // 0-100%
    const memoryUsage = Math.floor(Math.random() * 85) + 15; // 15-100%
    
    // Determine statuses based on metrics
    const apiStatus = apiResponseTime > 200 ? 'error' : apiResponseTime > 100 ? 'warning' : 'healthy';
    const dbStatus = dbConnectionTime > 50 ? 'error' : dbConnectionTime > 30 ? 'warning' : 'healthy';
    const errorStatus = errorRate > 3 ? 'error' : errorRate > 1 ? 'warning' : 'healthy';
    const loadStatus = systemLoad > 80 ? 'error' : systemLoad > 60 ? 'warning' : 'healthy';
    
    // Overall status based on worst individual status
    const statuses = [apiStatus, dbStatus, errorStatus, loadStatus];
    const overallStatus = statuses.includes('error') ? 'error' : 
                         statuses.includes('warning') ? 'warning' : 'healthy';

    const recentEvents: SystemEvent[] = [
      {
        type: 'healthy',
        message: 'Database backup completed successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toLocaleString()
      },
      {
        type: overallStatus === 'error' ? 'error' : 'healthy',
        message: overallStatus === 'error' ? 'High API response times detected' : 'All systems running normally',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleString()
      },
      {
        type: 'warning',
        message: 'Memory usage approaching 80% threshold',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleString()
      }
    ];

    return {
      overallStatus,
      apiResponseTime,
      apiStatus,
      apiPerformance: Math.max(0, 100 - (apiResponseTime / 250 * 100)),
      avgResponseTime: Math.floor(apiResponseTime * 0.8),
      dbConnectionTime,
      dbStatus,
      dbPerformance: Math.max(0, 100 - (dbConnectionTime / 60 * 100)),
      activeConnections: Math.floor(Math.random() * 50) + 10,
      maxConnections: 100,
      errorRate: Number(errorRate.toFixed(1)),
      errorStatus,
      recentErrors: Math.floor(errorRate * 10),
      systemLoad,
      loadStatus,
      memoryUsage,
      recentEvents
    };
  };

  const fetchHealthData = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate realistic metrics
      const data = generateRealisticMetrics();
      setHealthData(data);
    } catch (error) {
      console.error('Error fetching health data:', error);
      // Set error state
      setHealthData(prev => ({
        ...prev,
        overallStatus: 'error',
        recentEvents: [
          {
            type: 'error',
            message: 'Failed to fetch system health metrics',
            timestamp: new Date().toLocaleString()
          },
          ...prev.recentEvents.slice(0, 2)
        ]
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealthData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    healthData,
    loading,
    refresh: fetchHealthData
  };
}
