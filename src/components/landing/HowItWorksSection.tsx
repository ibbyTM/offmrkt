import { ClipboardList, Search, Shield, Key } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Register",
    description: "Complete our investor questionnaire and upload proof of funds.",
  },
  {
    icon: Search,
    step: "02",
    title: "Browse",
    description: "Access pre-screened investment properties with detailed analysis.",
  },
  {
    icon: Shield,
    step: "03",
    title: "Reserve",
    description: "Secure your property with a refundable deposit.",
  },
  {
    icon: Key,
    step: "04",
    title: "Complete",
    description: "Work with our recommended professionals to close the deal.",
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  return (
    <section id="how-it-works" ref={ref} className="py-20 md:py-28 bg-gradient-to-b from-background-secondary to-background scroll-mt-20">
      <div className="container">
        {/* Section Header */}
        <div className={cn(
          "mx-auto max-w-xl text-center mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            Simple Process
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How it works
          </h2>
        </div>

        {/* Steps - Horizontal flow */}
        <div className="relative">
          {/* Gradient connector line - desktop only */}
          <div className={cn(
            "hidden lg:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-1000",
            isVisible ? "opacity-100" : "opacity-0"
          )} />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div 
                key={item.step} 
                className={cn(
                  "relative text-center group transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: isVisible ? `${index * 120}ms` : "0ms" }}
              >
                {/* Step number with icon */}
                <div className="relative mx-auto mb-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent border border-primary/20 mx-auto group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
                    <item.icon className="h-10 w-10 text-primary" />
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/30">
                    {item.step}
                  </div>
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
