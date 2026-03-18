import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-background">
      <div className="container relative py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
              Off-market deals,{" "}
              <span className="text-primary">before anyone else.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              We connect property sellers with serious investors. No estate agents, 
              no bidding wars — just verified deals with transparent returns.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button asChild size="lg" variant="gradient" className="font-semibold text-base px-8 group">
                <Link to="/submit-property">
                  I Want to Sell
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold text-base px-8">
                <Link to="/register">
                  I Want to Buy
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              1,200+ investors · £50M+ invested · 8.5% avg yield
            </p>
          </motion.div>

          {/* Right — Stats block */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "500+", label: "Properties listed", accent: false },
              { value: "8.5%", label: "Average gross yield", accent: true },
              { value: "£50M+", label: "Total invested", accent: false },
              { value: "7 days", label: "Avg time to completion", accent: false },
            ].map((stat, i) => (
              <div
                key={i}
                className={`rounded-xl border border-border p-6 ${
                  stat.accent ? "bg-primary text-primary-foreground" : "bg-card"
                }`}
              >
                <div className={`text-3xl font-bold mb-1 ${stat.accent ? "" : "text-foreground"}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${stat.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
