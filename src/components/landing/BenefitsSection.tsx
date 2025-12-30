import { 
  Shield, 
  TrendingUp, 
  Users, 
  FileCheck, 
  Clock, 
  Handshake 
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: Shield,
    title: "Verified Investors Only",
    description: "Every investor is vetted through our comprehensive questionnaire and proof of funds verification.",
  },
  {
    icon: TrendingUp,
    title: "Quality Deal Flow",
    description: "Access pre-screened investment opportunities with detailed ROI analysis for multiple strategies.",
  },
  {
    icon: FileCheck,
    title: "Full Due Diligence",
    description: "All listings include EPC, gas safety, EICR documentation and floor plans where available.",
  },
  {
    icon: Clock,
    title: "Fast Transactions",
    description: "Streamlined process from viewing to completion. Reserve deals instantly with a refundable deposit.",
  },
  {
    icon: Users,
    title: "Professional Network",
    description: "Connect with recommended mortgage brokers, solicitors, and property managers.",
  },
  {
    icon: Handshake,
    title: "Seller Confidence",
    description: "Sellers know they're dealing with serious, qualified buyers — no time wasters.",
  },
];

export function BenefitsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className={cn(
          "mx-auto max-w-2xl text-center mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Why choose InvestorHub?
          </h2>
          <p className="text-lg text-muted-foreground">
            Built by investors, for investors. Every feature designed to make property investing simpler and more efficient.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={cn(
                "group relative rounded-xl border border-border bg-card p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-lg",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary transition-transform duration-300 group-hover:scale-110">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
