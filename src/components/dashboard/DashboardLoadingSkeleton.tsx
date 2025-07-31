import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-200/60 dark:bg-background px-4 py-8 animate-fade-in flex items-center justify-center page-transition">
      <div className="w-full max-w-5xl space-y-8">
        <div className="space-y-4 animate-slide-up">
          <Skeleton className="h-12 w-64 shadow-smooth bg-gray-300/40 dark:bg-muted" />
          <Skeleton className="h-6 w-40 shadow-smooth bg-gray-300/40 dark:bg-muted" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-in-left bg-gray-300/40 dark:bg-muted" style={{'--index': 0} as React.CSSProperties} />
          <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-up bg-gray-300/40 dark:bg-muted" style={{'--index': 1} as React.CSSProperties} />
          <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-in-right bg-gray-300/40 dark:bg-muted" style={{'--index': 2} as React.CSSProperties} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
          <Skeleton className="h-96 rounded-lg shadow-smooth animate-slide-in-left bg-gray-300/40 dark:bg-muted" style={{'--index': 0} as React.CSSProperties} />
          <Skeleton className="h-96 rounded-lg shadow-smooth animate-slide-in-right bg-gray-300/40 dark:bg-muted" style={{'--index': 1} as React.CSSProperties} />
        </div>
      </div>
    </div>
  );
}
