import { ClipboardList, Search, Shield, Key } from "lucide-react";

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
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-background-secondary">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
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
            <div key={item.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-border -translate-x-1/2" />
              )}
              
              <div className="text-center">
                <div className="relative mb-6 mx-auto">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-border shadow-sm mx-auto">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
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
