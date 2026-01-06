import { ClipboardList, Search, Shield, Key } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: ClipboardList,
    step: "1",
    title: "Register",
    description: "Complete our investor questionnaire and upload proof of funds.",
  },
  {
    icon: Search,
    step: "2",
    title: "Browse",
    description: "Access pre-screened investment properties with detailed analysis.",
  },
  {
    icon: Shield,
    step: "3",
    title: "Reserve",
    description: "Secure your property with a refundable deposit.",
  },
  {
    icon: Key,
    step: "4",
    title: "Complete",
    description: "Work with our recommended professionals to close the deal.",
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  return (
    <section id="how-it-works" ref={ref} className="py-20 md:py-24 bg-background-secondary scroll-mt-20">
      <div className="container">
        {/* Section Header */}
        <div className={cn(
          "mx-auto max-w-xl text-center mb-14 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
        </div>

        {/* Steps - Horizontal flow */}
        <div className="relative">
          {/* Connector line - desktop only */}
          <div className={cn(
            "hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-border transition-opacity duration-1000",
            isVisible ? "opacity-100" : "opacity-0"
          )} />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div 
                key={item.step} 
                className={cn(
                  "relative text-center transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
              >
                {/* Step number */}
                <div className="relative mx-auto mb-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background border-2 border-primary text-primary font-bold text-xl mx-auto">
                    {item.step}
                  </div>
                </div>
                
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
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
