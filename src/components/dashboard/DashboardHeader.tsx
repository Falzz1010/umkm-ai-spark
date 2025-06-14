
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onSignOut: () => void;
}

export function DashboardHeader({ title, subtitle, onSignOut }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" onClick={onSignOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </div>
  );
}
