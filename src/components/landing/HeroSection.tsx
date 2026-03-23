import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, TrendingUp, Bell, BarChart3, Home, Shield } from "lucide-react";
import { motion } from "framer-motion";

const partners = ["PropertyMark", "RICS", "ARLA", "NAEA", "The Guild"];

const floatingCards = [
  {
    title: "New Deal Alert",
    icon: Bell,
    content: "3-bed terraced in Manchester",
    detail: "8.2% yield · £85,000",
    rotation: "rotate-[-4deg]",
    position: "left-[2%] top-[15%]",
    delay: 0,
  },
  {
    title: "Portfolio Stats",
    icon: BarChart3,
    content: "Average Gross Yield",
    detail: "8.5%",
    rotation: "rotate-[2deg]",
    position: "left-[22%] top-[5%]",
    delay: 0.8,
  },
  {
    title: "Featured Property",
    icon: Home,
    content: "4-bed semi, Birmingham",
    detail: "£120,000 · 9.1% yield",
    rotation: "rotate-[-1deg]",
    position: "left-[42%] top-[0%]",
    delay: 0.4,
    featured: true,
  },
  {
    title: "Market Insight",
    icon: TrendingUp,
    content: "North West prices",
    detail: "+4.2% this quarter",
    rotation: "rotate-[3deg]",
    position: "left-[62%] top-[8%]",
    delay: 1.2,
  },
  {
    title: "Verified Deal",
    icon: Shield,
    content: "Due diligence complete",
    detail: "Ready to exchange",
    rotation: "rotate-[-2deg]",
    position: "left-[80%] top-[18%]",
    delay: 0.6,
  },
];

function FloatingCards() {
  return (
    <div
      className="relative w-full h-[280px] md:h-[320px] mt-8 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 + card.delay * 0.3 }}
          className={`absolute ${card.position} ${card.rotation}`}
          style={{
            animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${card.delay}s`,
          }}
        >
          <div
            className={`bg-white/[0.08] backdrop-blur-md border border-white/[0.15] rounded-2xl p-5 ${
              card.featured ? "w-[220px] md:w-[260px]" : "w-[190px] md:w-[220px]"
            } shadow-2xl shadow-black/20`}
          >
            <div className="flex items-center gap-2 mb-3">
              <card.icon className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                {card.title}
              </span>
            </div>
            <p className="text-sm font-medium text-white/90 mb-1">
              {card.content}
            </p>
            <p
              className={`text-xs ${
                card.featured
                  ? "text-primary font-bold text-base"
                  : "text-white/50"
              }`}
            >
              {card.detail}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-900">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.15)_0%,_transparent_70%)] pointer-events-none" />

        <div className="container relative pt-20 pb-6 lg:pt-28 lg:pb-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge
                variant="outline"
                className="mb-6 px-4 py-1.5 text-sm font-medium gap-1.5 border-white/20 text-white/80"
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
              className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-white"
            >
              Off-market deals,{" "}
              <span className="text-primary">before anyone else.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-white/60 mb-8 max-w-2xl"
            >
              We connect property sellers with serious investors. No estate
              agents, no bidding wars — just verified deals with transparent
              returns.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-4"
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
                className="font-semibold text-base px-8 border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/register">I Want to Buy</Link>
              </Button>
            </motion.div>
          </div>

          {/* Floating cards */}
          <FloatingCards />
        </div>
      </section>

      {/* Trust logos strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-background border-b border-border py-5"
      >
        <div className="container flex flex-col items-center gap-3">
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
        </div>
      </motion.div>
    </>
  );
}
