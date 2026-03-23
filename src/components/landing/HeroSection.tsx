import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
      </div>

      <div className="container relative py-24 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Off-market deals,{" "}
              <span className="text-primary">before anyone else.</span>
            </h1>

            <p className="text-lg text-white/70 mb-8 max-w-lg">
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
              <Button asChild size="lg" variant="outline" className="font-semibold text-base px-8 border-white/30 text-white hover:bg-white/10">
                <Link to="/register">
                  I Want to Buy
                </Link>
              </Button>
            </div>
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
              { value: "7 days", label: "Avg time to completion", accent: false },
              { value: "£0", label: "Seller fees", accent: false },
            ].map((stat, i) => (
              <div
                key={i}
                className={`rounded-xl p-6 ${
                  stat.accent
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                }`}
              >
                <div className={`text-3xl font-bold mb-1 ${stat.accent ? "" : "text-white"}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${stat.accent ? "text-primary-foreground/80" : "text-white/60"}`}>
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
