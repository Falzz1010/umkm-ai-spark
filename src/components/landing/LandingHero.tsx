
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

export function LandingHero() {
  const navigate = useNavigate();
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative py-24 lg:py-40 overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-100/80 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 transition-colors duration-500"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              🚀 Platform AI Terdepan untuk UMKM
            </Badge>
          </motion.div>
          
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Transformasi
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Digital </span>
            UMKM Anda
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Platform AI terpadu yang membantu UMKM mengembangkan bisnis dengan teknologi kecerdasan buatan.
            Kelola produk, generate konten berkualitas, dan dapatkan insights bisnis yang actionable.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button size="lg"
                className="text-lg px-10 py-7 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border-0"
                onClick={() => navigate('/auth')}>
                Mulai Gratis Sekarang
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button size="lg"
                variant="outline"
                className="text-lg px-10 py-7 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl border-gray-200 transition-all duration-300"
                onClick={() => navigate('/auth')}>
                Lihat Demo
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {[
              { icon: Check, text: "Gratis 14 hari" },
              { icon: Check, text: "Tanpa kartu kredit" },
              { icon: Check, text: "Setup 5 menit" }
            ].map((item, index) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className="h-4 w-4 text-green-600" />
                <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
