
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Move, 
  Plus,
  BarChart3,
  Users,
  Package,
  Bot,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Widget {
  id: string;
  title: string;
  type: string;
  icon: any;
  visible: boolean;
  position: number;
}

interface WidgetCustomizerProps {
  onWidgetChange: (widgets: Widget[]) => void;
  isCustomizing: boolean;
  onToggleCustomize: () => void;
}

export function WidgetCustomizer({ 
  onWidgetChange, 
  isCustomizing, 
  onToggleCustomize 
}: WidgetCustomizerProps) {
  const { toast } = useToast();
  
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'stats', title: 'Statistics Cards', type: 'stats', icon: BarChart3, visible: true, position: 1 },
    { id: 'users', title: 'User Management', type: 'users', icon: Users, visible: true, position: 2 },
    { id: 'products', title: 'Product Overview', type: 'products', icon: Package, visible: true, position: 3 },
    { id: 'ai', title: 'AI Analytics', type: 'ai', icon: Bot, visible: true, position: 4 },
    { id: 'health', title: 'System Health', type: 'health', icon: Activity, visible: true, position: 5 }
  ]);

  const availableWidgets = [
    { id: 'revenue', title: 'Revenue Chart', type: 'chart', icon: BarChart3 },
    { id: 'notifications', title: 'Notifications', type: 'alerts', icon: Activity },
    { id: 'logs', title: 'System Logs', type: 'logs', icon: Activity }
  ];

  const toggleWidgetVisibility = (widgetId: string) => {
    const updatedWidgets = widgets.map(w => 
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    );
    setWidgets(updatedWidgets);
    onWidgetChange(updatedWidgets);
  };

  const addWidget = (widgetType: any) => {
    const newWidget: Widget = {
      id: `${widgetType.id}-${Date.now()}`,
      title: widgetType.title,
      type: widgetType.type,
      icon: widgetType.icon,
      visible: true,
      position: widgets.length + 1
    };
    
    const updatedWidgets = [...widgets, newWidget];
    setWidgets(updatedWidgets);
    onWidgetChange(updatedWidgets);
    
    toast({
      title: "Widget Added",
      description: `${widgetType.title} has been added to your dashboard`,
    });
  };

  const saveLayout = () => {
    toast({
      title: "Layout Saved",
      description: "Your dashboard layout has been saved successfully",
    });
    onToggleCustomize();
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Dashboard Customization
          </CardTitle>
          <Button
            variant={isCustomizing ? "default" : "outline"}
            size="sm"
            onClick={isCustomizing ? saveLayout : onToggleCustomize}
          >
            {isCustomizing ? 'Save Layout' : 'Customize'}
          </Button>
        </div>
      </CardHeader>
      
      {isCustomizing && (
        <CardContent className="space-y-4">
          {/* Current Widgets */}
          <div>
            <h4 className="text-sm font-medium mb-2">Current Widgets</h4>
            <div className="space-y-2">
              {widgets.map((widget) => {
                const Icon = widget.icon;
                return (
                  <div key={widget.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Move className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{widget.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={widget.visible}
                        onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                      />
                      {widget.visible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Widgets */}
          <div>
            <h4 className="text-sm font-medium mb-2">Add Widgets</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableWidgets.map((widget) => {
                const Icon = widget.icon;
                return (
                  <Button
                    key={widget.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addWidget(widget)}
                    className="justify-start"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    <Icon className="h-3 w-3 mr-1" />
                    {widget.title}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t">
            <Badge variant="outline" className="text-xs">
              Drag widgets to reorder • Toggle visibility • Add new widgets
            </Badge>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
