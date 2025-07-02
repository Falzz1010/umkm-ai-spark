
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LogOut, Bell, Settings, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useSweetAlert } from '@/hooks/useSweetAlert';
import { SettingsDialog } from './SettingsDialog';
import { ProfileDialog } from './ProfileDialog';
import { NotificationsDrawer } from './NotificationsDrawer';
import { DateTime } from './DateTime';
import { useNotificationsCtx } from '@/hooks/NotificationsContext';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { signOut } = useAuth();
  const { showConfirm, showLoading, closeLoading } = useSweetAlert();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Use the notifications context (single provider)
  const { notifications, loading } = useNotificationsCtx();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    const result = await showConfirm(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari akun ini?'
    );

    if (result.isConfirmed) {
      try {
        showLoading('Sedang logout...');
        await signOut();
      } catch (error) {
        closeLoading();
        console.error('Error during logout:', error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4 mb-6 sm:mb-8 w-full max-w-full">
        {/* Mobile-first header layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground break-words">
                {title}
              </h1>
              <Badge variant="secondary" className="w-fit">
                Pro User
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              {subtitle}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            {/* Date Time - hidden on mobile */}
            <div className="hidden md:block">
              <DateTime />
            </div>

            {/* Notification Button */}
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs" variant="destructive">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-card z-50">
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => setProfileOpen(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Dialogs and Drawers */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <NotificationsDrawer open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </>
  );
}
