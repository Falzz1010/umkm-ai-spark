
import { Sparkles } from 'lucide-react';
import { motion } from "framer-motion";

export function LandingFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-gray-200 dark:bg-background border-t border-gray-300 dark:border-border py-12"
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          className="flex items-center justify-center space-x-2 mb-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-foreground">AI UMKM</span>
        </motion.div>
        <motion.p
          className="text-gray-600 dark:text-muted-foreground mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
        >
          Empowering Indonesian SMEs with AI Technology
        </motion.p>
        <motion.p
          className="text-sm text-gray-500 dark:text-muted-foreground"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
        >
          &copy; 2024 AI Asisten UMKM. Dikembangkan dengan ❤️ untuk mendukung UMKM Indonesia.
        </motion.p>
      </div>
    </motion.footer>
  );
}
