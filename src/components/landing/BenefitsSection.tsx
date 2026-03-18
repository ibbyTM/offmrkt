import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Curated deals, not listings",
    description:
      "Every property is hand-picked and verified. We reject over 60% of submissions so you only see deals worth your time.",
    stat: "510+",
    statLabel: "Active deals",
  },
  {
    number: "02",
    title: "Full investment analysis",
    description:
      "Yield projections, ROI breakdowns, and market comparisons — calculated for you on every property.",
    stat: "£517K",
    statLabel: "Avg property value",
  },
  {
    number: "03",
    title: "Early access alerts",
    description:
      "Get notified about new deals matching your criteria before they go to the wider market.",
    stat: "24h",
    statLabel: "Early access window",
  },
  {
    number: "04",
    title: "Verified sellers only",
    description:
      "All sellers go through identity checks and property due diligence before listing.",
    stat: "100%",
    statLabel: "Verified",
  },
];

export function BenefitsSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why investors choose us
          </h2>
          <p className="text-muted-foreground max-w-xl">
            We built the tools we wished existed when we started investing.
          </p>
        </motion.div>

        <div className="space-y-0 divide-y divide-border">
          {features.map((feature, i) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="grid md:grid-cols-[4rem_1fr_8rem] gap-4 md:gap-8 items-baseline py-8 first:pt-0"
            >
              {/* Number */}
              <span className="text-sm font-mono text-muted-foreground hidden md:block">
                {feature.number}
              </span>

              {/* Text */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm max-w-lg">
                  {feature.description}
                </p>
              </div>

              {/* Stat */}
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{feature.stat}</div>
                <div className="text-xs text-muted-foreground">{feature.statLabel}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
