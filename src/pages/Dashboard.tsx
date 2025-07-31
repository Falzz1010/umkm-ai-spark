
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationsProvider } from '@/hooks/NotificationsContext';
import { DashboardLoadingSkeleton } from '@/components/dashboard/DashboardLoadingSkeleton';

export default function Dashboard() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading skeleton while authenticating or fetching user role
  if (loading || (user && !userRole)) {
    return <DashboardLoadingSkeleton />;
  }

  // After loading, if there's no user, we render nothing,
  // relying on the useEffect to handle the redirect.
  if (!user) {
    return null;
  }

  // If user exists but role could not be determined (and not loading anymore)
  if (!userRole) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-200/60 dark:bg-background">
        <div className="p-8 bg-card rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Akses Ditolak</h2>
          <p className="text-red-600 text-lg font-semibold">
            Akun Anda belum memiliki peran yang valid.
          </p>
          <p className="text-muted-foreground mt-2">
            Silakan hubungi administrator untuk mendapatkan hak akses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <NotificationsProvider>
      <div className="min-h-screen bg-gray-200/60 dark:bg-background px-2 sm:px-6 py-6 page-transition animate-fade-in">
        <div className="mx-auto max-w-7xl">
          {userRole === 'admin' ? <AdminDashboard /> : <UserDashboard />}
        </div>
      </div>
    </NotificationsProvider>
  );
}
