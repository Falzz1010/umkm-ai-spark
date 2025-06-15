
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { RoleGuard } from '@/components/common/RoleGuard';
import { UserRole } from '@/types/database';

interface ReusableDashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  requiredRoles?: UserRole[];
  className?: string;
  children?: ReactNode;
}

export function ReusableDashboardCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-primary",
  trend,
  requiredRoles,
  className = "",
  children
}: ReusableDashboardCardProps) {
  const cardContent = (
    <Card className={`transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className={`text-xs mt-1 ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}% dari periode sebelumnya
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );

  if (requiredRoles) {
    return (
      <RoleGuard allowedRoles={requiredRoles}>
        {cardContent}
      </RoleGuard>
    );
  }

  return cardContent;
}
