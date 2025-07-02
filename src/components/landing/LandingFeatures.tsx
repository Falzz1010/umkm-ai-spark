
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Package, ChartBar, Users } from 'lucide-react';
import { motion } from "framer-motion";

export function LandingFeatures() {
  const features = [
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Generate deskripsi produk, caption promosi, dan saran bisnis dengan AI',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Package,
      title: 'Manajemen Produk',
      description: 'Kelola produk, harga, stok, dan kategori dengan mudah',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: ChartBar,
      title: 'Analytics Dashboard',
      description: 'Monitor performa bisnis dengan grafik dan insights mendalam',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Users,
      title: 'Role Management',
      description: 'Sistem role Admin dan User dengan akses berbeda',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="py-8 xs:py-12 sm:py-20 bg-gray-200 dark:bg-muted/30"
    >
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-6 xs:mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Badge variant="outline" className="mb-2 xs:mb-3 sm:mb-4 text-xs p-1 xs:p-2 bg-white dark:bg-background">✨ Fitur Unggulan</Badge>
          <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-foreground mb-2 xs:mb-3 sm:mb-4 px-2">
            Semua yang Anda Butuhkan dalam Satu Platform
          </h2>
          <p className="text-sm xs:text-base sm:text-xl text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto px-4">
            Solusi lengkap untuk mengoptimalkan operasional dan marketing UMKM Anda
          </p>
        </motion.div>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ scale: 1.04 }}
              className="relative group"
            >
              <Card className="relative border-0 bg-white dark:bg-background/70 backdrop-blur transition-all duration-300 group-hover:shadow-2xl hover-scale shadow-md h-full">
                <CardHeader className="text-center pb-2 xs:pb-4 px-3 xs:px-4">
                  <div className="mx-auto mb-2 xs:mb-3 sm:mb-4 w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 rounded-lg xs:rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-background dark:to-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow">
                    <feature.icon className={`h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-sm xs:text-base sm:text-xl text-gray-800 dark:text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-2 xs:px-3 sm:px-0">
                  <CardDescription className="text-xs xs:text-sm leading-relaxed text-gray-600 dark:text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
