
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

export function LandingCTA() {
  const navigate = useNavigate();
  return (
    <motion.section
      className="py-20 relative overflow-hidden"
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
      <div className="relative max-w-4xl mx-auto text-center px-4 text-white">
        <motion.h2
          className="text-3xl lg:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          Siap Mengembangkan Bisnis UMKM Anda?
        </motion.h2>
        <motion.p
          className="text-xl mb-8 opacity-90"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.23 }}
        >
          Bergabunglah dengan ribuan UMKM yang sudah merasakan transformasi digital
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.33 }}
        >
          <motion.div whileHover={{ scale: 1.08 }}>
            <Button size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 hover-scale shadow-xl"
              onClick={() => navigate('/auth')}>
              Mulai Gratis Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }}>
            <Button size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-600 hover-scale transition"
              onClick={() => navigate('/auth')}>
              Hubungi Sales
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
