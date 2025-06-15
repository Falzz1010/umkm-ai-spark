
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/database';

export function useRoleValidation() {
  const { userRole, loading } = useAuth();

  const hasRole = (requiredRole: UserRole): boolean => {
    if (loading || !userRole) return false;
    
    // Admin memiliki akses ke semua role
    if (userRole === 'admin') return true;
    
    // User hanya bisa akses role user
    return userRole === requiredRole;
  };

  const isAdmin = (): boolean => {
    return userRole === 'admin';
  };

  const isUser = (): boolean => {
    return userRole === 'user';
  };

  const canAccess = (allowedRoles: UserRole[]): boolean => {
    if (loading || !userRole) return false;
    return allowedRoles.includes(userRole);
  };

  return {
    userRole,
    loading,
    hasRole,
    isAdmin,
    isUser,
    canAccess
  };
}
