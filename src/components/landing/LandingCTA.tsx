
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

export function LandingCTA() {
  const navigate = useNavigate();
  return (
    <motion.section
      className="py-24 lg:py-32 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Enhanced Background with Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative max-w-5xl mx-auto text-center px-4 text-white">
        <motion.h2
          className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Siap Mengembangkan Bisnis UMKM Anda?
        </motion.h2>
        
        <motion.p
          className="text-xl lg:text-2xl mb-10 opacity-90 font-light leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Bergabunglah dengan ribuan UMKM yang sudah merasakan transformasi digital
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button size="lg"
              variant="secondary"
              className="text-lg px-10 py-7 rounded-2xl bg-white text-gray-900 hover:bg-gray-100 shadow-2xl font-semibold"
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
              className="text-lg px-10 py-7 rounded-2xl border-2 border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm transition-all duration-300"
              onClick={() => navigate('/auth')}>
              Hubungi Sales
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
