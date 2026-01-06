import { Shield, TrendingUp, FileCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Shield,
    title: "Verified Investors",
    description: "Every investor is vetted through our verification process and proof of funds check.",
  },
  {
    icon: TrendingUp,
    title: "Quality Deal Flow",
    description: "Pre-screened investment opportunities with detailed ROI analysis.",
  },
  {
    icon: FileCheck,
    title: "Full Documentation",
    description: "All listings include EPC, gas safety, and EICR documentation where available.",
  },
];

export function BenefitsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className={cn(
          "mx-auto max-w-xl text-center mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            Why Choose Us
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Built for serious investors
          </h2>
        </div>

        {/* Benefits Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              className={cn(
                "group relative overflow-hidden border-border/60 bg-gradient-to-b from-background to-accent/20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : "0ms" }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="relative p-8 text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                  <benefit.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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
