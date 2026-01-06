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
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "InvestorHub has completely transformed how I source investment properties. The pre-screening saves me countless hours.",
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
            opts={{
              align: "start",
              loop: true,
            }}
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
            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious className="relative left-0 translate-y-0" />
              <CarouselNext className="relative right-0 translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
