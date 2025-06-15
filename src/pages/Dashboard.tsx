
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

  useEffect(() => {
    console.log("Dashboard mount: loading:", loading, "user:", user, "userRole:", userRole, "path:", window.location.pathname);
    
    // Only redirect to auth if not loading and no user
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // Don't do anything if still loading or if user exists but role is being fetched
    if (loading || !user) {
      return;
    }

    // Only sign out if user is authenticated but explicitly has no role after loading is complete
    // Give some time for the role to be fetched before considering it missing
    if (user && userRole === null && !loading) {
      // Add a delay to allow role fetching to complete
      const timeoutId = setTimeout(() => {
        if (userRole === null && user) {
          console.log("No userRole found after timeout, signOut called!");
          signOut();
        }
      }, 3000); // Wait 3 seconds for role to be fetched

      return () => clearTimeout(timeoutId);
    }
  }, [user, loading, userRole, navigate, signOut]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200/60 dark:bg-background px-4 py-8 animate-fade-in flex items-center justify-center page-transition">
        <div className="w-full max-w-5xl space-y-8">
          <div className="space-y-4 animate-slide-up">
            <Skeleton className="h-12 w-64 shadow-smooth bg-gray-300/40 dark:bg-muted" />
            <Skeleton className="h-6 w-40 shadow-smooth bg-gray-300/40 dark:bg-muted" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-in-left bg-gray-300/40 dark:bg-muted" style={{'--index': 0} as any} />
            <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-up bg-gray-300/40 dark:bg-muted" style={{'--index': 1} as any} />
            <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-in-right bg-gray-300/40 dark:bg-muted" style={{'--index': 2} as any} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
            <Skeleton className="h-96 rounded-lg shadow-smooth animate-slide-in-left bg-gray-300/40 dark:bg-muted" style={{'--index': 0} as any} />
            <Skeleton className="h-96 rounded-lg shadow-smooth animate-slide-in-right bg-gray-300/40 dark:bg-muted" style={{'--index': 1} as any} />
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while role is being fetched
  if (user && userRole === null) {
    return (
      <div className="min-h-screen bg-gray-200/60 dark:bg-background px-4 py-8 animate-fade-in flex items-center justify-center page-transition">
        <div className="w-full max-w-5xl space-y-8">
          <div className="space-y-4 animate-slide-up">
            <Skeleton className="h-12 w-64 shadow-smooth bg-gray-300/40 dark:bg-muted" />
            <Skeleton className="h-6 w-40 shadow-smooth bg-gray-300/40 dark:bg-muted" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-in-left bg-gray-300/40 dark:bg-muted" style={{'--index': 0} as any} />
            <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-up bg-gray-300/40 dark:bg-muted" style={{'--index': 1} as any} />
            <Skeleton className="h-40 rounded-lg shadow-smooth animate-slide-in-right bg-gray-300/40 dark:bg-muted" style={{'--index': 2} as any} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
            <Skeleton className="h-96 rounded-lg shadow-smooth animate-slide-in-left bg-gray-300/40 dark:bg-muted" style={{'--index': 0} as any} />
            <Skeleton className="h-96 rounded-lg shadow-smooth animate-slide-in-right bg-gray-300/40 dark:bg-muted" style={{'--index': 1} as any} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show error message if user exists but still no role after loading
  if (user && !userRole) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-200/60 dark:bg-background">
        <p className="text-red-600 text-lg font-semibold">
          Akses ditolak! Akun Anda belum memiliki role yang benar.<br />
          Silakan hubungi admin.
        </p>
      </div>
    );
  }

  // Log info sebelum render dashboard
  console.log("Render dashboard. userRole:", userRole);

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
