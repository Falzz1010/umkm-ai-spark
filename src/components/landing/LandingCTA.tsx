
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

export function LandingCTA() {
  const navigate = useNavigate();
  return (
    <motion.section
      className="py-8 xs:py-10 sm:py-20 relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      ></motion.div>
      <div className="relative max-w-4xl mx-auto text-center px-3 xs:px-4 text-white">
        <motion.h2
          className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 xs:mb-3 sm:mb-4"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          Siap Mengembangkan Bisnis UMKM Anda?
        </motion.h2>
        <motion.p
          className="text-sm xs:text-base sm:text-xl mb-4 xs:mb-6 sm:mb-8 opacity-90 px-2"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.23 }}
        >
          Bergabunglah dengan ribuan UMKM yang sudah merasakan transformasi digital
        </motion.p>
        <motion.div
          className="flex flex-col gap-2 xs:gap-3 sm:gap-4 justify-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.33 }}
        >
          <motion.div whileHover={{ scale: 1.08 }}>
            <Button
              size="default"
              variant="secondary"
              className="w-full xs:w-full sm:w-auto text-sm xs:text-base sm:text-lg px-4 py-2 xs:px-6 xs:py-4 sm:px-8 sm:py-6 hover-scale shadow-xl"
              onClick={() => navigate('/auth')}
            >
              Mulai Gratis Sekarang
              <ArrowRight className="ml-1 xs:ml-2 h-4 w-4 xs:h-5 xs:w-5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }}>
            <Button
              size="default"
              variant="outline"
              className="w-full xs:w-full sm:w-auto text-sm xs:text-base sm:text-lg px-4 py-2 xs:px-6 xs:py-4 sm:px-8 sm:py-6 border-white text-white hover:bg-white hover:text-purple-600 hover-scale transition"
              onClick={() => navigate('/auth')}
            >
              Hubungi Sales
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
