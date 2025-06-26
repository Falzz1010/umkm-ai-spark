
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
        "ml-0 lg:ml-64", // No margin on mobile, full margin on desktop
        "peer-data-[state=collapsed]:ml-0 lg:peer-data-[state=collapsed]:ml-16", 
        "w-full overflow-x-hidden min-h-screen"
      )}>
        <div className="h-full w-full">
          {/* Mobile top padding for menu button */}
          <div className="pt-12 lg:pt-0 max-w-full mx-auto w-full">
            <div className="animate-fade-in p-3 sm:p-4 lg:p-6">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
