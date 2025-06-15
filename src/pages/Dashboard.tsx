import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationsProvider } from '@/hooks/NotificationsContext';

export default function Dashboard() {
  const { user, userRole, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Cek akses dashboard yang benar sesuai role
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }

    // Jika user login dari admin/login tapi bukan admin (Atau sebaliknya), signOut
    if (!loading && user && window.location.pathname === '/dashboard') {
      // Role admin: boleh akses. Role user: redirect ke user dashboard
      // Di dalam dashboard, jadi kita bisa cek
      if (!userRole) {
        signOut();
      } else if (
        (userRole === 'admin' && window.location.pathname !== '/dashboard') ||
        (userRole === 'user' && window.location.pathname !== '/dashboard')
      ) {
        signOut();
      }
    }
  }, [user, loading, userRole, navigate, signOut]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 animate-fade-in flex items-center justify-center page-transition">
        <div className="w-full max-w-5xl space-y-8">
          <div className="space-y-4 animate-slide-up">
            <Skeleton className="h-12 w-64 shadow-smooth" />
            <Skeleton className="h-6 w-40 shadow-smooth" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-in-left" style={{'--index': 0} as any} />
            <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-up" style={{'--index': 1} as any} />
            <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-in-right" style={{'--index': 2} as any} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
            <Skeleton className="h-96 rounded-lg shadow-smooth animate-slide-in-left" style={{'--index': 0} as any} />
            <Skeleton className="h-96 rounded-lg shadow-smooth animate-slide-in-right" style={{'--index': 1} as any} />
          </div>
        </div>
      </div>
    );
  }

  if (!user || !userRole) {
    // Jangan render dashboard sama sekali jika tidak ada user atau role
    return null;
  }

  return (
    <NotificationsProvider>
      <div className="min-h-screen bg-background px-2 sm:px-6 py-6 page-transition animate-fade-in">
        <div className="mx-auto max-w-7xl">
          {userRole === 'admin' ? <AdminDashboard /> : <UserDashboard />}
        </div>
      </div>
    </NotificationsProvider>
  );
}
