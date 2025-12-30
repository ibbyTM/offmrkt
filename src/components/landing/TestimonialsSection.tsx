import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "InvestorHub has completely transformed how I source deals. The quality of properties and the vetting process for both buyers and sellers gives me confidence in every transaction.",
    author: "James Mitchell",
    role: "Property Investor",
    location: "Manchester",
    rating: 5,
    avatar: "JM",
  },
  {
    quote: "As a seller, knowing that I'm dealing with verified investors who have proof of funds makes the process so much smoother. No more time wasters.",
    author: "Sarah Thompson",
    role: "Property Developer",
    location: "London",
    rating: 5,
    avatar: "ST",
  },
  {
    quote: "The ROI breakdowns for different strategies helped me identify opportunities I would have otherwise missed. Already completed two purchases through the platform.",
    author: "David Chen",
    role: "Portfolio Investor",
    location: "Birmingham",
    rating: 5,
    avatar: "DC",
  },
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background-secondary">
      <div className="container">
        {/* Section Header */}
        <div className={cn(
          "mx-auto max-w-2xl text-center mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Trusted by investors nationwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from property professionals who've found success through our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={cn(
                "relative rounded-2xl border border-border bg-card p-8 transition-all duration-700 hover:shadow-lg hover:border-primary/30",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : "0ms" }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
