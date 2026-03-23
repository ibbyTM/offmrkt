import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function DualPathSection() {
  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            How can we help?
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {/* Sell Card */}
          <motion.div variants={itemVariants}>
            <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-10 md:p-12 h-full flex flex-col hover:scale-[1.02] transition-transform duration-300">
              <h3 className="text-3xl font-bold mb-3">I want to sell</h3>

              <p className="text-primary-foreground/80 mb-6 leading-relaxed flex-1">
                Get cash offers from our network of verified investors.
                No estate agent fees, no chains, completions from 7 days.
              </p>

              <ul className="space-y-2 mb-8 text-sm text-primary-foreground/90">
                {["Cash offers within 24 hours", "No fees or commissions", "Complete in as little as 7 days"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary-foreground/70 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button asChild size="lg" variant="secondary" className="w-full group font-semibold">
                <Link to="/submit-property">
                  Submit Your Property
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Buy Card */}
          <motion.div variants={itemVariants}>
            <div className="rounded-xl bg-slate-900 text-white p-10 md:p-12 h-full flex flex-col hover:scale-[1.02] transition-transform duration-300">
              <h3 className="text-3xl font-bold mb-3">I want to buy</h3>

              <p className="text-slate-300 mb-6 leading-relaxed flex-1">
                Access exclusive off-market deals before anyone else.
                Verified opportunities with full investment analysis.
              </p>

              <ul className="space-y-2 mb-8 text-sm text-slate-400">
                {["Exclusive off-market deals", "Full investment analysis", "High-yield opportunities"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button asChild size="lg" variant="outline" className="w-full group border-white/30 text-white hover:bg-white/10 font-semibold">
                <Link to="/register">
                  Browse Deals
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
