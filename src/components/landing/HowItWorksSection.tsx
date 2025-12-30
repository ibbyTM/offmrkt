import { ClipboardList, Search, Shield, Key } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Register & Get Verified",
    description: "Complete our investor questionnaire and upload proof of funds. Our team reviews applications within 24-48 hours.",
  },
  {
    icon: Search,
    step: "02",
    title: "Browse Vetted Deals",
    description: "Access our marketplace of pre-screened investment properties with detailed analysis for multiple strategies.",
  },
  {
    icon: Shield,
    step: "03",
    title: "Reserve Your Property",
    description: "Found your ideal investment? Reserve it with a refundable deposit to take it off the market while you complete due diligence.",
  },
  {
    icon: Key,
    step: "04",
    title: "Complete & Collect Keys",
    description: "Work with our recommended professionals to complete the purchase. We're with you every step of the way.",
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  return (
    <section id="how-it-works" ref={ref} className="py-20 md:py-28 bg-background scroll-mt-20">
      <div className="container">
        {/* Section Header */}
        <div className={cn(
          "mx-auto max-w-2xl text-center mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            From registration to keys in hand — our streamlined process makes property investing straightforward.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div 
              key={item.step} 
              className={cn(
                "relative transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : "0ms" }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-border to-transparent -translate-x-1/2 transition-opacity duration-1000",
                  isVisible ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDelay: isVisible ? `${(index + 1) * 200}ms` : "0ms" }}
                />
              )}
              
              <div className="text-center group">
                <div className="relative mb-6 mx-auto">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-border shadow-sm mx-auto transition-all duration-300 group-hover:shadow-md group-hover:border-primary/30">
                    <item.icon className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
