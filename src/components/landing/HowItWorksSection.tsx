import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Create your profile",
    description: "Sign up in under 2 minutes. Tell us your budget, preferred locations, and strategy.",
  },
  {
    number: "02",
    title: "Browse curated deals",
    description: "Every listing includes yield calculations, market data, and compliance documents.",
  },
  {
    number: "03",
    title: "Reserve instantly",
    description: "Found a match? Reserve it in one click before other investors see it.",
  },
  {
    number: "04",
    title: "Complete with support",
    description: "Our team handles solicitors, mortgage brokers, and property management referrals.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-muted-foreground max-w-xl">
            From sign-up to completion in four steps.
          </p>
        </motion.div>

        {/* Horizontal timeline on desktop, vertical on mobile */}
        <div className="grid md:grid-cols-4 gap-8 md:gap-6 relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-5 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px bg-border" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              {/* Step number marker */}
              <div className="w-10 h-10 rounded-full border-2 border-primary bg-background flex items-center justify-center mb-4 relative z-10">
                <span className="text-sm font-bold text-primary">{step.number}</span>
              </div>

              <h3 className="text-base font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
