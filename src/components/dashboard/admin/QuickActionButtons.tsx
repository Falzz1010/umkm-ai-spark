
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Download, 
  Settings, 
  Bell, 
  Users, 
  Package, 
  BarChart3,
  Plus,
  Filter,
  Search
} from 'lucide-react';

interface QuickActionButtonsProps {
  onRefresh: () => void;
  onExport: () => void;
  onSettings: () => void;
  onNotifications: () => void;
}

export function QuickActionButtons({
  onRefresh,
  onExport,
  onSettings,
  onNotifications
}: QuickActionButtonsProps) {
  const quickActions = [
    {
      id: 'refresh',
      label: 'Refresh Data',
      icon: RefreshCw,
      onClick: onRefresh,
      variant: 'outline' as const,
      shortcut: 'Ctrl+R'
    },
    {
      id: 'export',
      label: 'Export Reports',
      icon: Download,
      onClick: onExport,
      variant: 'outline' as const,
      shortcut: 'Ctrl+E'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      onClick: onNotifications,
      variant: 'outline' as const,
      badge: '3'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: onSettings,
      variant: 'outline' as const
    }
  ];

  const managementActions = [
    { label: 'Add User', icon: Users, color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Add Product', icon: Package, color: 'bg-green-500 hover:bg-green-600' },
    { label: 'View Analytics', icon: BarChart3, color: 'bg-purple-500 hover:bg-purple-600' }
  ];

  return (
    <div className="space-y-4">
      {/* Primary Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <div key={action.id} className="relative">
              <Button
                variant={action.variant}
                size="sm"
                onClick={action.onClick}
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{action.label}</span>
                {action.shortcut && (
                  <Badge variant="secondary" className="ml-1 text-xs hidden lg:inline">
                    {action.shortcut}
                  </Badge>
                )}
              </Button>
              {action.badge && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {action.badge}
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      {/* Management Actions */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Quick Management</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {managementActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`justify-start ${action.color} text-white border-0 hover:scale-105 transition-all`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Filter Presets */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Filter Presets</div>
        <div className="flex flex-wrap gap-1">
          {[
            'Active Users',
            'New Products',
            'High AI Usage',
            'Low Stock',
            'Recent Activity'
          ].map((preset) => (
            <Badge
              key={preset}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
            >
              {preset}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
