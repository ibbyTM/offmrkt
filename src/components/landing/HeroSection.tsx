import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const CrystalHouse = lazy(() =>
  import("@/components/landing/CrystalHouse").then((m) => ({
    default: m.CrystalHouse,
  }))
);

const partners = ["PropertyMark", "RICS", "ARLA", "NAEA", "The Guild"];

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "8.5%", label: "Avg Gross Yield" },
  { value: "7 Days", label: "Avg Completion" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Subtle gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/40 pointer-events-none" />

      <div className="container relative pt-20 pb-10 lg:pt-28 lg:pb-14">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 text-sm font-medium gap-1.5 border-primary/30"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI Property Analysis
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-foreground"
          >
            Off-market deals,{" "}
            <span className="text-primary">before anyone else.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl"
          >
            We connect property sellers with serious investors. No estate agents,
            no bidding wars — just verified deals with transparent returns.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <Button
              asChild
              size="lg"
              variant="gradient"
              className="font-semibold text-base px-8 group"
            >
              <Link to="/submit-property">
                I Want to Sell
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-semibold text-base px-8"
            >
              <Link to="/register">I Want to Buy</Link>
            </Button>
          </motion.div>

          {/* Trust logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-3 mb-4"
          >
            <p className="text-xs text-muted-foreground tracking-wide uppercase">
              Trusted by leading professionals
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {partners.map((p) => (
                <span
                  key={p}
                  className="text-xs font-bold text-muted-foreground/50 tracking-wider"
                >
                  {p}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 3D Crystal House */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Suspense
            fallback={
              <div className="w-full h-[250px] md:h-[350px] lg:h-[400px] flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            }
          >
            <CrystalHouse />
          </Suspense>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-center justify-center gap-8 md:gap-16 pt-4"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
