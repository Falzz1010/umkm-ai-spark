
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
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

  // Auto play
  React.useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [emblaApi]);

  // Listen to changes
  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative max-w-3xl mx-auto group">
      {/* Arrow Left */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Testimoni sebelumnya"
        className="absolute top-1/2 z-20 -translate-y-1/2 bg-white/80 dark:bg-zinc-900/80 shadow-lg rounded-full border border-zinc-200 dark:border-zinc-700 p-2 transition hover:scale-110 active:scale-95 hover:bg-blue-500 hover:text-white left-2 sm:left-[-2.2rem]"
        tabIndex={0}
        style={{ display: testimonials.length < 2 ? 'none' : undefined }}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Carousel */}
      <div className="overflow-visible" ref={emblaRef}>
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
                    initial={{ opacity: 0, y: 60, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.96 }}
                    transition={{
                      duration: 0.52,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex items-center justify-center h-full"
                  >
                    <Card className="bg-white/95 dark:bg-zinc-900/95 border-0 sm:p-1 shadow-smooth card-hover rounded-2xl transition-all duration-400 mx-auto max-w-lg">
                      <CardHeader>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow" />
                          ))}
                        </div>
                        <CardDescription className="text-base italic text-zinc-800 dark:text-zinc-200/90">
                          “{testimonial.content}”
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
      </div>

      {/* Arrow Right */}
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Testimoni berikutnya"
        className="absolute top-1/2 z-20 -translate-y-1/2 bg-white/80 dark:bg-zinc-900/80 shadow-lg rounded-full border border-zinc-200 dark:border-zinc-700 p-2 transition hover:scale-110 active:scale-95 hover:bg-blue-500 hover:text-white right-2 sm:right-[-2.2rem]"
        tabIndex={0}
        style={{ display: testimonials.length < 2 ? 'none' : undefined }}
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-7 gap-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`transition-all duration-200 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2
              ${selectedIndex === idx
                ? "bg-blue-600 border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.12)] scale-110"
                : "bg-zinc-200 dark:bg-zinc-600 border-zinc-300 dark:border-zinc-600 hover:bg-blue-200 dark:hover:bg-blue-900"
              }
            `}
            aria-label={`Go to testimonial ${idx + 1}`}
            onClick={() => emblaApi?.scrollTo(idx)}
          />
        ))}
      </div>
    </div>
  );
};
