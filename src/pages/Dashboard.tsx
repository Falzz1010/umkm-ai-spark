import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationsProvider } from '@/hooks/NotificationsContext';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

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
      <div className="min-h-screen bg-background p-4 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-4">
            <Skeleton className="h-12 w-96" />
            <Skeleton className="h-6 w-64" />
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

  return (
    <NotificationsProvider>
      <div className="min-h-screen bg-background transition-colors duration-200">
        {userRole === 'admin' ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </NotificationsProvider>
  );
}
