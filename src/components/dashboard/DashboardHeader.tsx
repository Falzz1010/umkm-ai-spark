
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

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { signOut } = useAuth();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
            {title}
          </h1>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Pro User
          </Badge>
        </div>
        <p className="text-muted-foreground text-base lg:text-lg">
          {subtitle}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Notification Button */}
        <Button variant="outline" size="icon" className="relative hidden sm:flex">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
            3
          </Badge>
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
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={signOut} 
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
