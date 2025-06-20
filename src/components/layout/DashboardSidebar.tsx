
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  BarChart3, 
  Bot, 
  ShoppingCart, 
  DollarSign, 
  Home,
  Menu,
  X,
  Settings,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    description: 'Overview & Statistics'
  },
  {
    title: 'Produk Saya',
    icon: Package,
    href: '/dashboard/products',
    description: 'Kelola produk Anda'
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    description: 'Laporan & Analisis'
  },
  {
    title: 'AI Assistant',
    icon: Bot,
    href: '/dashboard/ai',
    description: 'Bantuan AI'
  },
  {
    title: 'Penjualan',
    icon: ShoppingCart,
    href: '/dashboard/sales',
    description: 'Transaksi & History'
  },
  {
    title: 'Smart Pricing',
    icon: DollarSign,
    href: '/dashboard/pricing',
    description: 'Saran Harga AI'
  }
];

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { profile, signOut } = useAuth();

  return (
    <aside 
      className={cn(
        "peer fixed left-0 top-0 z-40 h-full bg-white dark:bg-card border-r border-border transition-all duration-300",
        "max-lg:absolute max-lg:z-50", // Make it overlay on mobile
        isCollapsed ? "w-16" : "w-64"
      )}
      data-state={isCollapsed ? "collapsed" : "expanded"}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-primary">UMKM AI</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{item.title}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-border p-4">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  UMKM AI User
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="h-8 w-8"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title={profile?.full_name || 'User Profile'}
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="h-8 w-8"
                title="Sign Out"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile overlay background */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </aside>
  );
}
