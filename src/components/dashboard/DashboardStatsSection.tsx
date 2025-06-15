
import { DashboardStatsCards } from './DashboardStatsCards';
import { ProductFinanceCards } from './ProductFinanceCards';
import { DashboardStats } from '@/types/dashboard';

interface DashboardStatsSectionProps {
  stats: DashboardStats;
  omzet: number;
  laba: number;
}

export function DashboardStatsSection({ stats, omzet, laba }: DashboardStatsSectionProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 stagger-children bg-gray-50/50 dark:bg-background/50 p-4 rounded-xl">
      <div className="animate-bounce-subtle animate-slide-in-left" style={{'--index': 0} as any}>
        <ProductFinanceCards omzet={omzet} laba={laba} />
      </div>
      <div className="animate-slide-in-right animate-scale-in" style={{'--index': 1} as any}>
        <DashboardStatsCards stats={stats} />
      </div>
    </div>
  );
}
