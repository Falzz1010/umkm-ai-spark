
import { UserRole } from '@/types/database';

export const ROLE_PERMISSIONS = {
  admin: {
    canViewAllData: true,
    canDeleteAnyData: true,
    canManageUsers: true,
    canAccessAnalytics: true,
    canManageProducts: true,
    canManageTransactions: true,
    canManageAI: true
  },
  user: {
    canViewAllData: false,
    canDeleteAnyData: false,
    canManageUsers: false,
    canAccessAnalytics: true,
    canManageProducts: true,
    canManageTransactions: true,
    canManageAI: true
  }
} as const;

export function hasPermission(
  userRole: UserRole | null, 
  permission: keyof typeof ROLE_PERMISSIONS.admin
): boolean {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole][permission];
}

export function canAccessRoute(userRole: UserRole | null, route: string): boolean {
  if (!userRole) return false;
  
  // Admin routes
  if (route.startsWith('/admin') && userRole !== 'admin') {
    return false;
  }
  
  // Dashboard routes accessible to both admin and user
  if (route.startsWith('/dashboard')) {
    return ['admin', 'user'].includes(userRole);
  }
  
  return true;
}

export function getDefaultRoute(userRole: UserRole | null): string {
  if (!userRole) return '/auth';
  
  // Both admin and user go to dashboard
  return '/dashboard';
}

export function sanitizeUserInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .substring(0, 1000); // Limit length
}

export function validatePermissionForAction(
  userRole: UserRole | null,
  action: 'create' | 'read' | 'update' | 'delete',
  resource: 'products' | 'transactions' | 'users' | 'ai_generations'
): boolean {
  if (!userRole) return false;
  
  // Admin can do everything
  if (userRole === 'admin') return true;
  
  // User permissions
  if (userRole === 'user') {
    switch (resource) {
      case 'users':
        return action === 'read'; // Users can only read their own profile
      case 'products':
      case 'transactions':
      case 'ai_generations':
        return true; // Users can CRUD their own data
      default:
        return false;
    }
  }
  
  return false;
}
