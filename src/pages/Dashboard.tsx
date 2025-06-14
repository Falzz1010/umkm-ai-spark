
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 transition-all duration-500">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-4">
            <Skeleton className="h-12 w-96 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-6 w-64 bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <Skeleton className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <Skeleton className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <Skeleton className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-all duration-500">
      {userRole === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}
