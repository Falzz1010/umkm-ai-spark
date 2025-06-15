
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

  // Auto Play Logic
  React.useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3600);
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

  // Variants untuk animasi testimonial (ease changes only)
  const cardVariants = {
    hidden: { opacity: 0, y: 44, scale: 0.98, filter: "blur(2px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0)",
      transition: {
        duration: 0.62,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      y: -28,
      scale: 0.97,
      filter: "blur(4px)",
      transition: { duration: 0.45, ease: "easeOut" }
    }
  };

  return (
    <div className="overflow-visible max-w-3xl mx-auto relative">
      {/* effect glass pada latar belakang */}
      <div className="absolute inset-0 blur-[36px] opacity-20 pointer-events-none select-none z-0"
        style={{ background: "radial-gradient(circle at 60% 60%, #a5b4fc80 0%, #f0abfc30 80%, transparent 100%)" }}
      />
      <div className="flex relative z-10">
        {testimonials.map((testimonial, idx) => (
          <div
            className="min-w-0 shrink-0 grow-0 basis-full px-1 sm:px-2"
            key={testimonial.name}
            aria-hidden={selectedIndex !== idx}
          >
            <AnimatePresence mode="wait">
              {selectedIndex === idx && (
                <motion.div
                  key={testimonial.name}
                  className="h-full"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "spring", damping: 24, stiffness: 210 }}
                >
                  <Card className="glass-effect border-0 group transition-all duration-400 hover:shadow-2xl shadow-lg card-hover mx-auto max-w-lg">
                    <CardHeader>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-[0_1px_4px_rgba(251,224,0,0.11)]" />
                        ))}
                      </div>
                      <CardDescription className="text-base italic font-medium leading-relaxed text-muted-foreground">
                        "{testimonial.content}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      {/* Dots Navigation */}
      <div className="flex justify-center mt-9 gap-2 relative z-20">
        {testimonials.map((_, idx) => (
          <motion.button
            key={idx}
            className={`w-3.5 h-3.5 rounded-full outline-none border border-blue-400 transition-all duration-200 flex items-center justify-center
              ${selectedIndex === idx ? "bg-blue-600 scale-115 shadow-lg ring-2 ring-blue-300" : "bg-zinc-200 dark:bg-zinc-700"}`}
            aria-label={`Go to testimonial ${idx + 1}`}
            onClick={() => emblaApi?.scrollTo(idx)}
            whileHover={selectedIndex === idx ? {} : { scale: 1.18 }}
            whileTap={{ scale: 0.96 }}
          >
            {/* Extra visual center dot when active */}
            {selectedIndex === idx &&
              <span className="block w-2 h-2 bg-white rounded-full border border-blue-400"></span>
            }
          </motion.button>
        ))}
      </div>
    </div>
  );
};
