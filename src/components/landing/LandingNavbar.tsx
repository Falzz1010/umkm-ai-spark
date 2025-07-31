
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Sparkles, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

export function LandingNavbar() {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleNavigate = (path: string) => {
    setIsSheetOpen(false);
    navigate(path);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">AI UMKM</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => handleNavigate('/auth')}>Login</Button>
            <Button
              variant="outline"
              className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
              onClick={() => handleNavigate('/auth/admin')}
            >
              Login Admin
            </Button>
            <Button onClick={() => handleNavigate('/auth')}>Daftar Gratis</Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu" className="ml-2">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
                <div className="flex flex-col gap-2 py-6 px-6 min-h-screen">
                  <div className="flex items-center mb-6 space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-foreground">AI UMKM</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start" onClick={() => handleNavigate('/auth')}>
                      Login
                    </Button>
                    <Button variant="outline" className="justify-start text-indigo-600 border-indigo-600" onClick={() => handleNavigate('/auth/admin')}>
                      Login Admin
                    </Button>
                    <Button className="justify-start" onClick={() => handleNavigate('/auth')}>
                      Daftar Gratis
                    </Button>
                  </div>

                  <div className="mt-auto">
                    <ThemeToggle />
                  </div>

                  <SheetClose asChild>
                    <Button variant="ghost" size="sm" className="mt-4 self-center">
                      Tutup
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
