
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { profile } = useAuth();

  return (
    <>
      {/* Mobile Menu Button - Fixed position */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-3 left-3 z-50 bg-white dark:bg-card shadow-lg border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "peer fixed left-0 top-0 z-40 h-full bg-white dark:bg-card border-r border-border transition-all duration-300 font-sans shadow-lg lg:shadow-none",
          // Mobile behavior - slide in from left
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop collapsed/expanded
          isCollapsed ? "lg:w-16" : "lg:w-64",
          // Mobile always full width when open
          "w-72 lg:w-auto"
        )}
        data-state={isCollapsed ? "collapsed" : "expanded"}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border min-h-[4rem]">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-primary tracking-tight">UMKM AI</h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 hidden lg:flex hover:bg-accent"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground group",
                    isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                    isCollapsed && "lg:justify-center lg:px-2"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "group-hover:text-primary"
                  )} />
                  {(!isCollapsed || isMobileOpen) && (
                    <div className="flex flex-col min-w-0">
                      <span className="truncate font-medium">{item.title}</span>
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
            {(!isCollapsed || isMobileOpen) ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    UMKM AI User
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
