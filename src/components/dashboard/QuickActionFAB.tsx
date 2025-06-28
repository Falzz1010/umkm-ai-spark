
import { useState } from 'react';
import { Plus, Package, ShoppingCart, BarChart3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function QuickActionFAB() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Package,
      label: 'Tambah Produk',
      href: '/dashboard/products',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: ShoppingCart,
      label: 'Catat Penjualan',
      href: '/dashboard/sales',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: BarChart3,
      label: 'Lihat Analytics',
      href: '/dashboard/analytics',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      {isOpen && (
        <div className="flex flex-col gap-3 mb-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                to={action.href}
                className={`
                  ${action.color} text-white p-3 rounded-full shadow-lg
                  flex items-center gap-3 min-w-max animate-slide-in-right
                  hover:shadow-xl transition-all duration-300
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium pr-2">{action.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-lg transition-all duration-300
          ${isOpen ? 'bg-red-500 hover:bg-red-600 rotate-45' : 'bg-primary hover:bg-primary/90'}
        `}
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}
