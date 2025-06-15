
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationsProvider } from '@/hooks/NotificationsContext';

export default function Dashboard() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    // Perbaikan UI: lebih konsisten, spacing dan nuansa halus
    return (
      <div className="min-h-screen bg-background px-4 py-8 animate-fade-in flex items-center justify-center transition-colors duration-200">
        <div className="w-full max-w-5xl space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Penambahan kontainer dengan efek animasi & padding yang lebih nyaman
  return (
    <NotificationsProvider>
      <div className="min-h-screen bg-background px-2 sm:px-6 py-6 transition-colors duration-200">
        <div className="mx-auto max-w-7xl animate-fade-in">
          {userRole === 'admin' ? <AdminDashboard /> : <UserDashboard />}
        </div>
      </div>
    </NotificationsProvider>
  );
}
