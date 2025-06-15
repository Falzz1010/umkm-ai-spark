
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
      className="py-12 sm:py-20 bg-muted/30"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-9 sm:mb-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
        >
          <Badge variant="outline" className="mb-2 sm:mb-4 text-xs sm:text-sm p-2">
            ⭐ Testimoni
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-4">
            Dipercaya oleh Ribuan UMKM
          </h2>
        </motion.div>
        {/* Carousel with animation */}
        <CarouselTestimonial testimonials={testimonials} />
      </div>
    </motion.section>
  );
}
