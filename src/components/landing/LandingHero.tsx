
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

export function LandingHero() {
  const navigate = useNavigate();
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative py-14 sm:py-20 lg:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-100/60 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/20 transition-colors"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm p-2">
              🚀 Platform AI Terdepan untuk UMKM
            </Badge>
          </motion.div>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            Transformasi
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Digital{" "}
            </span>
            UMKM Anda
          </motion.h1>
          <motion.p
            className="text-base sm:text-xl text-muted-foreground mb-7 max-w-[95vw] sm:max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Platform AI terpadu yang membantu UMKM mengembangkan bisnis dengan teknologi kecerdasan buatan.
            Kelola produk, generate konten berkualitas, dan dapatkan insights bisnis yang actionable.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-7 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                size="lg"
                className="text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6 hover-scale shadow-lg transition-all duration-200"
                onClick={() => navigate('/auth')}
              >
                Mulai Gratis Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6 hover:bg-indigo-50 hover:text-indigo-700 border-indigo-100 transition-all duration-200"
                onClick={() => navigate('/auth')}
              >
                Lihat Demo
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-8 text-xs sm:text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Gratis 14 hari</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Tanpa kartu kredit</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Setup 5 menit</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
