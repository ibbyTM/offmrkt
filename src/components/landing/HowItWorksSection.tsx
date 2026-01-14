import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { UserPlus, Search, MousePointerClick, Bell } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your profile",
    description: "Sign up in under 2 minutes and tell us about your investment preferences and budget.",
  },
  {
    number: "02",
    icon: Search,
    title: "Explore listings",
    description: "Browse our curated selection of off-market properties with detailed analytics.",
  },
  {
    number: "03",
    icon: MousePointerClick,
    title: "Reserve in one click",
    description: "Found a deal you love? Reserve it instantly before it's gone.",
  },
  {
    number: "04",
    icon: Bell,
    title: "Receive updates",
    description: "Get real-time notifications on your reservations and new matching deals.",
  },
];

// Mini device mockups for each step
function StepMockup({ step }: { step: typeof steps[0] }) {
  return (
    <div className="bg-muted/50 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <div className="w-2 h-2 rounded-full bg-green-400" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-8 bg-primary/10 rounded-lg mt-3 flex items-center justify-center">
          <step.icon className="w-4 h-4 text-primary" />
        </div>
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How it works in 4 simple steps
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting started with OffMrkt is easy. Follow these simple steps to 
            begin your property investment journey.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="p-6 h-full border-border bg-card hover:shadow-lg transition-shadow relative overflow-hidden">
                {/* Step number watermark */}
                <div className="absolute -top-4 -right-2 text-8xl font-bold text-muted/30 select-none">
                  {step.number}
                </div>
                
                {/* Mockup */}
                <StepMockup step={step} />
                
                {/* Icon and content */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Step {step.number}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
