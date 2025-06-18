
import { ReactNode } from 'react';
import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 ml-64 transition-all duration-300">
        <div className="h-full p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
