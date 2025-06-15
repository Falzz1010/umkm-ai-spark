
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className = "" }: DashboardLayoutProps) {
  return (
    <div className={`px-1 py-2 sm:px-4 lg:p-6 max-w-7xl mx-auto animate-fade-in ${className}`}>
      {children}
    </div>
  );
}
