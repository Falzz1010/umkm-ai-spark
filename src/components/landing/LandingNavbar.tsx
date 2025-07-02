
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Sparkles, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

export function LandingNavbar() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const handleNavigation = (path: string) => {
    setSheetOpen(false);
    navigate(path);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">AI UMKM</span>
          </div>

          {!isMobile && (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" onClick={() => navigate('/auth')}>Login</Button>
              <Button
                variant="outline"
                className="text-indigo-600 border-indigo-600"
                onClick={() => navigate('/auth/admin')}
              >
                Login Admin
              </Button>
              <Button onClick={() => navigate('/auth')}>Daftar Gratis</Button>
            </div>
          )}

          {isMobile && (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Menu"
                  className="ml-2"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-foreground">AI UMKM</span>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="w-5 h-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  <div className="flex flex-col space-y-4 flex-1">
                    <div className="mb-6">
                      <ThemeToggle />
                    </div>
                    
                    <Button
                      variant="ghost"
                      className="justify-start w-full h-12 text-left"
                      onClick={() => handleNavigation('/auth')}
                    >
                      Login
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="justify-start w-full h-12 text-left text-indigo-600 border-indigo-600"
                      onClick={() => handleNavigation('/auth/admin')}
                    >
                      Login Admin
                    </Button>
                    
                    <Button
                      className="justify-start w-full h-12 text-left"
                      onClick={() => handleNavigation('/auth')}
                    >
                      Daftar Gratis
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
}
