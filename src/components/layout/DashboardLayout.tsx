
import { ReactNode } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex w-full font-sans">
      <DashboardSidebar />
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        // Desktop: Default margin for expanded sidebar
        "lg:ml-64", 
        // Desktop: Reduced margin when sidebar collapsed
        "peer-data-[state=collapsed]:lg:ml-16",
        // Mobile: No margin (sidebar becomes overlay)
        "ml-0",
        "w-full overflow-x-hidden min-h-screen"
      )}>
        <div className="h-full p-3 sm:p-4 lg:p-6 w-full max-w-full">
          <div className="max-w-7xl mx-auto w-full">
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
