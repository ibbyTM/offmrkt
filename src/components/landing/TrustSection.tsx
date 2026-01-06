import { Shield, UserCheck, FileCheck, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const credibilityItems = [
  {
    icon: Shield,
    text: "FCA Regulated Partners",
  },
  {
    icon: UserCheck,
    text: "Verified Investors",
  },
  {
    icon: FileCheck,
    text: "Screened Properties",
  },
  {
    icon: Award,
    text: "UK Based",
  },
];

export function TrustSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section 
      ref={ref}
      className="py-6 bg-gradient-to-r from-accent/50 via-accent/30 to-accent/50 border-y border-primary/10"
    >
      <div className="container">
        <div className={cn(
          "flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {credibilityItems.map((item, index) => (
            <div
              key={item.text}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-full bg-background/60 border border-primary/10 shadow-sm transition-all duration-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: isVisible ? `${index * 80}ms` : "0ms" }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
