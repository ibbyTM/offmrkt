import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DualPathSection() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Which describes you best?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Sell Card — solid primary bg */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-xl bg-primary text-primary-foreground p-8 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-3">I want to sell</h3>

              <p className="text-primary-foreground/80 mb-6 leading-relaxed flex-1">
                Get cash offers from our network of verified investors.
                No estate agent fees, no chains, completions from 7 days.
              </p>

              <ul className="space-y-2 mb-8 text-sm text-primary-foreground/90">
                {["Cash offers within 24 hours", "No fees or commissions", "Complete in as little as 7 days"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary-foreground/60" />
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

          {/* Buy Card — dark bg */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-xl bg-foreground text-background p-8 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-3">I want to buy</h3>

              <p className="text-background/70 mb-6 leading-relaxed flex-1">
                Access exclusive off-market deals before anyone else.
                Verified opportunities with full investment analysis.
              </p>

              <ul className="space-y-2 mb-8 text-sm text-background/80">
                {["Exclusive off-market deals", "Full investment analysis", "High-yield opportunities"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-background/50" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button asChild size="lg" variant="outline" className="w-full border-background/30 text-background hover:bg-background/10 font-semibold">
                <Link to="/register">
                  Browse Deals
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
