import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const partners = [
  { name: "Premier Properties", initials: "PP", gradient: "from-emerald-500 to-teal-600" },
  { name: "Investment Group UK", initials: "IG", gradient: "from-blue-500 to-indigo-600" },
  { name: "Finance Solutions", initials: "FS", gradient: "from-violet-500 to-purple-600" },
  { name: "Legal Services Pro", initials: "LS", gradient: "from-amber-500 to-orange-600" },
  { name: "Property Management Co", initials: "PM", gradient: "from-rose-500 to-pink-600" },
  { name: "Banking Partners", initials: "BP", gradient: "from-cyan-500 to-blue-600" },
];

export function TrustSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section 
      ref={ref}
      className="py-16 bg-background-secondary border-y border-border"
    >
      <div className="container">
        <p className={cn(
          "text-center text-sm font-medium tracking-wider text-muted-foreground mb-10 uppercase transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          Trusted by leading property investment companies
        </p>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center justify-items-center">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className={cn(
                "group flex h-14 w-28 items-center justify-center rounded-xl bg-gradient-to-br transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-lg",
                partner.gradient,
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: isVisible ? `${index * 80}ms` : "0ms" }}
              title={partner.name}
            >
              <span className="text-white font-bold text-lg tracking-wide">
                {partner.initials}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
