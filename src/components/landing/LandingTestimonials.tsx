
import { Badge } from '@/components/ui/badge';
import { motion } from "framer-motion";
import { CarouselTestimonial } from "./CarouselTestimonial";

export function LandingTestimonials() {
  const testimonials = [
    {
      name: 'Sarah Wijaya',
      business: 'Toko Fashion Online',
      content: 'AI Assistant membantu saya membuat deskripsi produk yang menarik. Penjualan meningkat 40% dalam 2 bulan!',
      rating: 5
    },
    {
      name: 'Ahmad Rahman',
      business: 'Kedai Kopi Local',
      content: 'Analytics dashboard memberikan insight yang sangat berguna untuk strategi marketing saya.',
      rating: 5
    },
    {
      name: 'Dewi Oktaviani',
      business: 'Warung Sembako Makmur',
      content: 'Fitur export ke Excel mempermudah saya mengelola laporan bulanan. Sangat membantu usaha kecil seperti saya!',
      rating: 5
    },
    {
      name: 'Budi Santoso',
      business: 'Bengkel Motor Sukses',
      content: 'Dengan dashboard analytics, saya jadi tahu produk/jasa mana yang paling diminati pelanggan.',
      rating: 4
    },
    {
      name: 'Linda Pranata',
      business: 'Katering Harian Sehat',
      content: 'Support yang responsif dan fitur AI membuat bisnis online saya semakin berkembang!',
      rating: 5
    }
  ];

  return (
    <motion.section
      className="py-24 lg:py-32 bg-gradient-to-b from-muted/20 to-muted/40"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            ⭐ Testimoni
          </Badge>
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Dipercaya oleh Ribuan UMKM
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Bergabunglah dengan komunitas UMKM yang telah merasakan transformasi digital
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <CarouselTestimonial testimonials={testimonials} />
        </motion.div>
      </div>
    </motion.section>
  );
}
