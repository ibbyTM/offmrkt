import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

const testimonials = [
  {
    quote: "OffMrkt has completely transformed how I source investment properties. The pre-screening saves me countless hours.",
    author: "James Mitchell",
    role: "Property Investor, Manchester",
    rating: 5,
    initials: "JM",
  },
  {
    quote: "The documentation and ROI analysis gave me confidence to make quick decisions. Closed on two properties in my first month.",
    author: "Sarah Thompson",
    role: "Portfolio Investor, London",
    rating: 5,
    initials: "ST",
  },
  {
    quote: "Finally a platform that takes investor verification seriously. The quality of deals is exceptional.",
    author: "David Chen",
    role: "Commercial Investor, Birmingham",
    rating: 5,
    initials: "DC",
  },
  {
    quote: "The streamlined process from reservation to completion is unmatched. Highly recommend for serious investors.",
    author: "Emma Williams",
    role: "BTL Investor, Leeds",
    rating: 5,
    initials: "EW",
  },
  {
    quote: "Access to verified off-market deals has given me a significant edge. Worth every penny.",
    author: "Michael Brown",
    role: "HMO Specialist, Liverpool",
    rating: 5,
    initials: "MB",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted"
          )}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <section ref={ref} className="relative py-20 md:py-28 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
      
      {/* Decorative side glows */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className={cn(
          "mx-auto max-w-xl text-center mb-12 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            What investors say
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className={cn(
          "transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-border bg-card hover:border-primary/30 transition-colors duration-300">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Quote icon */}
                      <Quote className="h-8 w-8 text-primary/20 mb-4" />
                      
                      {/* Rating */}
                      <StarRating rating={testimonial.rating} />
                      
                      {/* Quote text */}
                      <p className="mt-4 text-muted-foreground leading-relaxed flex-grow">
                        "{testimonial.quote}"
                      </p>
                      
                      {/* Author */}
                      <div className="mt-6 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {testimonial.initials}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{testimonial.author}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center items-center gap-4 mt-8">
              <CarouselPrevious className="relative left-0 translate-y-0" />
              
              {/* Navigation Dots */}
              <div className="flex gap-2">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      current === index 
                        ? "bg-primary w-6" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              <CarouselNext className="relative right-0 translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
