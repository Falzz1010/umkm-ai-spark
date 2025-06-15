import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TrendingUp, Bot, ChartBar, Check } from 'lucide-react';
import { motion } from "framer-motion";

export function LandingBenefits() {
  const benefits = [
    'Otomatisasi konten dengan AI',
    'Dashboard analytics real-time',
    'Export data ke Excel',
    'Multi-role access control',
    'Interface mobile-friendly',
    'Support 24/7'
  ];
  return (
    <motion.section
      className="py-12 sm:py-20"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm p-2">💡 Keunggulan Platform</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Mengapa Memilih AI UMKM?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Kami memahami tantangan UMKM dan menyediakan solusi yang tepat sasaran
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.09 + 0.1 }}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-foreground text-sm sm:text-base">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl transform rotate-3"></div>
            <Card className="relative bg-background/90 backdrop-blur border-0 p-4 sm:p-8 shadow-xl hover:shadow-2xl hover-scale transition">
              <div className="space-y-4 sm:space-y-6">
                <motion.div
                  className="flex items-center gap-3 sm:gap-4"
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base sm:text-lg">Peningkatan Penjualan</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Rata-rata 35% dalam 3 bulan</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 sm:gap-4"
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.32 }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base sm:text-lg">Efisiensi Waktu</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Hemat 60% waktu untuk konten</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 sm:gap-4"
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.44 }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <ChartBar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base sm:text-lg">Data-Driven Decision</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Insights bisnis yang akurat</p>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
