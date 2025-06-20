
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className = "" }: DashboardLayoutProps) {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
}
