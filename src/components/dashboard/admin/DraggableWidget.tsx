
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, X, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableWidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  onRemove?: () => void;
  onSettings?: () => void;
}

export function DraggableWidget({ 
  id, 
  title, 
  children, 
  className,
  onRemove,
  onSettings 
}: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative transition-all duration-200",
        isDragging && "opacity-50 scale-105 shadow-xl z-50",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onSettings}
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
          <div
            {...listeners}
            {...attributes}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          >
            <GripVertical className="h-3 w-3" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
