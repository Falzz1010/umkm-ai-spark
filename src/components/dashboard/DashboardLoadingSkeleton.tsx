
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardLoadingSkeleton() {
  return (
    <div className="px-1 py-2 sm:px-4 lg:p-6 max-w-7xl mx-auto">
      <div className="space-y-4 animate-slide-up">
        <Skeleton className="h-12 w-64 shadow-smooth" />
        <Skeleton className="h-6 w-40 shadow-smooth" />
      </div>
      <div className="flex flex-col gap-2 sm:gap-4 mb-2 sm:mb-4 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 stagger-children">
          <Skeleton className="h-24 shadow-smooth animate-slide-in-left" style={{'--index': 0} as any} />
          <Skeleton className="h-24 shadow-smooth animate-slide-in-right" style={{'--index': 1} as any} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 stagger-children">
          <Skeleton className="h-24 shadow-smooth animate-slide-in-left" style={{'--index': 0} as any} />
          <Skeleton className="h-24 shadow-smooth animate-slide-up" style={{'--index': 1} as any} />
          <Skeleton className="h-24 shadow-smooth animate-slide-in-right" style={{'--index': 2} as any} />
        </div>
      </div>
      <Skeleton className="h-96 w-full shadow-smooth animate-fade-in" />
    </div>
  );
}
