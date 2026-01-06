import { Shield, TrendingUp, FileCheck, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Shield,
    title: "Verified Investors",
    description: "Vetted through our verification process and proof of funds check.",
  },
  {
    icon: TrendingUp,
    title: "Quality Deal Flow",
    description: "Pre-screened opportunities with detailed ROI analysis.",
  },
  {
    icon: FileCheck,
    title: "Full Documentation",
    description: "EPC, gas safety, and EICR documentation included.",
  },
  {
    icon: Clock,
    title: "Fast Transactions",
    description: "Streamlined process from reservation to completion.",
  },
];

export function BenefitsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <div className={cn(
          "mx-auto max-w-xl text-center mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            Why Choose Us
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Built for serious investors
          </h2>
        </div>

        {/* Benefits Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              className={cn(
                "group relative overflow-hidden border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : "0ms" }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="relative p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
