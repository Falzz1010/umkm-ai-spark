
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

type Testimonial = {
  name: string;
  business: string;
  content: string;
  rating: number;
};

interface CarouselTestimonialProps {
  testimonials: Testimonial[];
}

export const CarouselTestimonial: React.FC<CarouselTestimonialProps> = ({ testimonials }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Auto Play Logic with smoother transitions
  React.useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000); // Increased interval for better readability
    return () => clearInterval(interval);
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="overflow-hidden max-w-4xl mx-auto" ref={emblaRef}>
      <div className="flex">
        {testimonials.map((testimonial, idx) => (
          <div
            className="min-w-0 shrink-0 grow-0 basis-full px-4"
            key={testimonial.name}
            aria-hidden={selectedIndex !== idx}
          >
            <AnimatePresence mode="wait">
              {selectedIndex === idx && (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ 
                    duration: 0.7, 
                    ease: [0.25, 0.1, 0.25, 1],
                    scale: { duration: 0.5 }
                  }}
                >
                  <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg"></div>
                    
                    <CardHeader className="relative z-10 pb-6">
                      <motion.div 
                        className="flex items-center gap-2 mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                          >
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                        ))}
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <CardDescription className="text-lg italic text-gray-700 leading-relaxed font-medium">
                          "{testimonial.content}"
                        </CardDescription>
                      </motion.div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-4"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-lg">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground font-medium">{testimonial.business}</p>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      {/* Enhanced Dots Navigation */}
      <motion.div 
        className="flex justify-center mt-8 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {testimonials.map((_, idx) => (
          <motion.button
            key={idx}
            className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              selectedIndex === idx 
                ? "bg-blue-600 border-blue-600 scale-125" 
                : "bg-transparent border-gray-300 hover:border-blue-400"
            }`}
            whileHover={{ scale: selectedIndex === idx ? 1.25 : 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to testimonial ${idx + 1}`}
            onClick={() => emblaApi?.scrollTo(idx)}
          >
            {selectedIndex === idx && (
              <motion.div
                className="absolute inset-0 bg-blue-600 rounded-full"
                layoutId="activeIndicator"
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};
