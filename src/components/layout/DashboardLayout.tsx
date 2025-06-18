
import { ReactNode } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex w-full">
      <DashboardSidebar />
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        "ml-64 lg:ml-64", // Default margin for desktop
        "peer-data-[state=collapsed]:ml-16", // Margin when sidebar collapsed
        "max-lg:ml-0", // No margin on mobile
        "w-full max-w-none" // Ensure full width utilization
      )}>
        <div className="h-full p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
