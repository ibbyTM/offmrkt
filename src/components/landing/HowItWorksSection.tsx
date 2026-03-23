import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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
    <section id="how-it-works" className="py-20 bg-slate-900">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-slate-400 max-w-xl">
            From sign-up to completion in four steps.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8 md:gap-6 relative"
        >
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-5 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px bg-slate-700" />

          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative"
            >
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center mb-4 relative z-10">
                <span className="text-sm font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
