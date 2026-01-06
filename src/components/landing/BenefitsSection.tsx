import { Shield, TrendingUp, FileCheck } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

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
    <section ref={ref} className="py-20 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className={cn(
          "mx-auto max-w-xl text-center mb-14 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why InvestorHub
          </h2>
        </div>

        {/* Benefits - 3 column with dividers */}
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={cn(
                "px-6 py-8 md:py-0 text-center transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : "0ms" }}
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-primary">
                <benefit.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
