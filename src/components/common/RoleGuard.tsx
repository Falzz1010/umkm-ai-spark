
import { ReactNode } from 'react';
import { useRoleValidation } from '@/hooks/common/useRoleValidation';
import { UserRole } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback,
  loadingComponent 
}: RoleGuardProps) {
  const { canAccess, loading } = useRoleValidation();

  if (loading) {
    return loadingComponent || (
      <div className="animate-pulse space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!canAccess(allowedRoles)) {
    return fallback || (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Anda tidak memiliki akses untuk melihat konten ini.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
