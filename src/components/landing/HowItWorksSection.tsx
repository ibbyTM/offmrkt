import { ClipboardList, Search, Shield, Key, User, Home, CreditCard, Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Register",
    description: "Complete our investor questionnaire and upload proof of funds.",
    mockupType: "registration",
  },
  {
    icon: Search,
    step: "02",
    title: "Browse",
    description: "Access pre-screened investment properties with detailed analysis.",
    mockupType: "browse",
  },
  {
    icon: Shield,
    step: "03",
    title: "Reserve",
    description: "Secure your property with a refundable deposit.",
    mockupType: "reserve",
  },
  {
    icon: Key,
    step: "04",
    title: "Complete",
    description: "Work with our recommended professionals to close the deal.",
    mockupType: "complete",
  },
];

// Mini UI mockup components
function RegistrationMockup() {
  return (
    <div className="space-y-2 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <User className="h-3 w-3" />
        <span>Investor Registration</span>
      </div>
      <div className="h-2 w-full rounded bg-muted" />
      <div className="h-2 w-3/4 rounded bg-muted" />
      <div className="h-6 w-full rounded bg-primary/20 mt-2" />
      <div className="h-2 w-full rounded bg-muted" />
      <div className="h-5 w-20 rounded bg-primary mt-2" />
    </div>
  );
}

function BrowseMockup() {
  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Home className="h-3 w-3" />
        <span>Property Listings</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-8 rounded bg-muted" />
            <div className="h-1.5 w-3/4 rounded bg-muted" />
            <div className="h-1.5 w-1/2 rounded bg-primary/30" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReserveMockup() {
  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <CreditCard className="h-3 w-3" />
        <span>Reserve Property</span>
      </div>
      <div className="h-12 rounded bg-muted mb-2" />
      <div className="space-y-1 mb-3">
        <div className="h-1.5 w-full rounded bg-muted" />
        <div className="h-1.5 w-2/3 rounded bg-muted" />
      </div>
      <div className="h-6 w-full rounded bg-primary flex items-center justify-center">
        <span className="text-[8px] text-primary-foreground font-medium">Reserve Now</span>
      </div>
    </div>
  );
}

function CompleteMockup() {
  return (
    <div className="p-3 flex flex-col items-center justify-center h-full">
      <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
        <Check className="h-5 w-5 text-green-500" />
      </div>
      <div className="text-[10px] font-medium text-center mb-1">Transaction Complete</div>
      <div className="h-1.5 w-16 rounded bg-muted" />
    </div>
  );
}

function MockupCard({ type }: { type: string }) {
  const mockups: Record<string, React.ReactNode> = {
    registration: <RegistrationMockup />,
    browse: <BrowseMockup />,
    reserve: <ReserveMockup />,
    complete: <CompleteMockup />,
  };

  return (
    <Card className="h-32 w-full bg-card/80 border-border/50 overflow-hidden">
      {mockups[type]}
    </Card>
  );
}

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  return (
    <section id="how-it-works" ref={ref} className="py-20 md:py-28 bg-secondary/30 scroll-mt-20">
      <div className="container">
        {/* Section Header */}
        <div className={cn(
          "mx-auto max-w-xl text-center mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-3">
            Simple Process
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            How it works
          </h2>
        </div>

        {/* Steps - Horizontal flow */}
        <div className="relative">
          {/* Gradient connector line - desktop only */}
          <div className={cn(
            "hidden lg:block absolute top-[120px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-1000",
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
                {/* UI Mockup Preview */}
                <div className="mb-4 group-hover:scale-[1.02] transition-transform duration-300">
                  <MockupCard type={item.mockupType} />
                </div>

                {/* Step number with icon */}
                <div className="relative mx-auto mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-card border border-border mx-auto group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-lg shadow-primary/30">
                    {item.step}
                  </div>
                </div>
                
                <h3 className="mb-2 text-lg font-bold">
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
