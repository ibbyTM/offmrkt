import { Shield, UserCheck, FileCheck } from "lucide-react";
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
];

export function TrustSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section 
      ref={ref}
      className="py-8 bg-background border-y border-border"
    >
      <div className="container">
        <div className={cn(
          "flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {credibilityItems.map((item, index) => (
            <div
              key={item.text}
              className="flex items-center gap-2.5 text-muted-foreground"
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
            >
              <item.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
