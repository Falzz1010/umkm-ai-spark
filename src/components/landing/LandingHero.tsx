
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, TrendingUp, Sparkles, ArrowRight, Users, ChartBar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingHero() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-8 xs:py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 xs:space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-2 py-1 xs:px-3 xs:py-1 sm:px-4 sm:py-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-1 xs:mr-1 sm:mr-2" />
              <span className="text-xs xs:text-xs sm:text-sm">Platform AI Terdepan untuk UMKM Indonesia</span>
            </Badge>
          </div>

          {/* Main heading */}
          <div className="space-y-3 xs:space-y-4 sm:space-y-6">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight px-1 xs:px-2">
              <span className="block">Revolusi Digital</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                UMKM dengan AI
              </span>
            </h1>
            
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2 xs:px-4">
              Platform all-in-one yang mengintegrasikan kekuatan AI untuk mengelola produk, menganalisis bisnis, 
              dan mengoptimalkan strategi pemasaran UMKM Anda.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 justify-center items-center px-3 xs:px-4">
            <Button 
              size="default"
              className="w-full xs:w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => navigate('/auth')}
            >
              Mulai Gratis Sekarang
              <ArrowRight className="ml-1 xs:ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="default"
              className="w-full xs:w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 text-sm font-semibold transition-all duration-200"
              onClick={() => navigate('/auth/admin')}
            >
              Demo Admin
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 xs:gap-6 sm:gap-8 pt-6 xs:pt-8 sm:pt-12 max-w-4xl mx-auto px-2 xs:px-4">
            <div className="text-center space-y-1 xs:space-y-2">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                <Bot className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">AI-Powered</div>
              <div className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300">Teknologi Gemini AI</div>
            </div>
            
            <div className="text-center space-y-1 xs:space-y-2">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Real-time</div>
              <div className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300">Analytics Dashboard</div>
            </div>
            
            <div className="text-center space-y-1 xs:space-y-2 xs:col-span-3 sm:col-span-1">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                <ChartBar className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Smart</div>
              <div className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300">Business Insights</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
