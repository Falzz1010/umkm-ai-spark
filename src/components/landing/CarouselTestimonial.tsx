
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
    }, 3400);
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
    <div className="overflow-hidden max-w-3xl mx-auto" ref={emblaRef}>
      <div className="flex">
        {testimonials.map((testimonial, idx) => (
          <div
            className="min-w-0 shrink-0 grow-0 basis-full px-2"
            key={testimonial.name}
            aria-hidden={selectedIndex !== idx}
          >
            <AnimatePresence mode="wait">
              {selectedIndex === idx && (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Card className="bg-background/70 backdrop-blur border-0 group transition-all duration-300 hover:shadow-2xl shadow-lg">
                    <CardHeader>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <CardDescription className="text-base italic">
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
      <div className="flex justify-center mt-6 gap-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full border border-zinc-300 ${selectedIndex === idx ? "bg-blue-600" : "bg-zinc-200"}`}
            aria-label={`Go to testimonial ${idx + 1}`}
            onClick={() => emblaApi?.scrollTo(idx)}
          />
        ))}
      </div>
    </div>
  );
};

