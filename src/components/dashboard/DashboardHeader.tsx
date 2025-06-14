
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

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onSignOut: () => void;
}

export function DashboardHeader({ title, subtitle, onSignOut }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <Badge variant="secondary" className="hidden sm:inline-flex bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
            Pro User
          </Badge>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg font-medium">
          {subtitle}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Notification Button */}
        <Button variant="outline" size="icon" className="relative hidden sm:flex">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
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
          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              <Settings className="h-4 w-4 mr-2" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              <User className="h-4 w-4 mr-2" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem 
              onClick={onSignOut} 
              className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
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
