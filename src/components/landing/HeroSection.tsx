import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Shield, TrendingUp, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

/* ── Reusable SVG Dashed Arrow ── */
function DashedArrow({ width = 50 }: { width?: number }) {
  return (
    <svg width={width} height="20" viewBox={`0 0 ${width} 20`} fill="none" className="shrink-0">
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--primary))" />
        </marker>
      </defs>
      <line
        x1="0" y1="10" x2={width - 8} y2="10"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
}

const partners = [
  "Silks Property Academy",
  "GoHighLevel",
  "Rightmove",
  "Zoopla",
  "OnTheMarket",
  "NRLA",
];

/* ── Floating Cards ── */

function FloatingCardNewDeal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="absolute left-[2%] top-[6%] z-20 hidden lg:block"
      style={{ animation: "float 4s ease-in-out infinite" }}
    >
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4 w-[220px]">
        <div className="flex items-center gap-2 mb-2">
          <Home className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            New Deal Alert
          </span>
        </div>
        <p className="text-sm font-medium text-foreground">
          3-bed terraced · Manchester
        </p>
        <p className="text-xs text-muted-foreground">£85,000 · 8.2% yield</p>
      </div>
    </motion.div>
  );
}

function FloatingCardVerified() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="absolute right-[2%] top-[6%] z-20 hidden lg:block"
      style={{ animation: "float 4.5s ease-in-out infinite 0.5s" }}
    >
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4 w-[210px]">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Verified Deal
          </span>
        </div>
        <p className="text-sm font-medium text-foreground">
          Due diligence complete
        </p>
        <p className="text-xs text-muted-foreground">Ready to exchange</p>
      </div>
    </motion.div>
  );
}

function FloatingCardToggles() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="absolute left-[3%] bottom-[18%] z-20 hidden lg:block"
      style={{ animation: "float 5s ease-in-out infinite 1s" }}
    >
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4 w-[240px] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-foreground">90%</span>
            <p className="text-xs text-muted-foreground">Off-market only</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-foreground">8x</span>
            <p className="text-xs text-muted-foreground">
              More deals than Rightmove
            </p>
          </div>
          <Switch />
        </div>
      </div>
    </motion.div>
  );
}

function FloatingCardMarket() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="absolute right-[3%] bottom-[18%] z-20 hidden lg:block"
      style={{ animation: "float 4.2s ease-in-out infinite 0.8s" }}
    >
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4 w-[210px]">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Market Insight
          </span>
        </div>
        <p className="text-sm font-medium text-foreground">
          North West prices
        </p>
        <p className="text-xs text-green-600 font-semibold">
          +4.2% this quarter
        </p>
      </div>
    </motion.div>
  );
}

/* ── Mobile floating cards (2x2 grid) ── */

function MobileFloatingCards() {
  return (
    <div className="grid grid-cols-2 gap-3 mt-8 lg:hidden">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Home className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            New Deal
          </span>
        </div>
        <p className="text-xs font-medium text-foreground">
          3-bed · Manchester
        </p>
        <p className="text-[10px] text-muted-foreground">
          £85k · 8.2% yield
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Verified
          </span>
        </div>
        <p className="text-xs font-medium text-foreground">DD complete</p>
        <p className="text-[10px] text-muted-foreground">Ready to exchange</p>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-foreground">90%</span>
          <span className="text-[10px] text-muted-foreground">Off-market</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">8x</span>
          <span className="text-[10px] text-muted-foreground">
            More deals
          </span>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Market
          </span>
        </div>
        <p className="text-xs font-medium text-foreground">NW prices</p>
        <p className="text-[10px] text-green-600 font-semibold">
          +4.2% this quarter
        </p>
      </div>
    </div>
  );
}

/* ── Pipeline Flow (centre visual, lg only) ── */

const propertyImages = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=100&h=80&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=100&h=80&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=80&fit=crop",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=100&h=80&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=100&h=80&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&h=80&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&h=80&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=80&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=100&h=80&fit=crop",
];

const portals = [
  { name: "Rightmove", color: "text-red-500" },
  { name: "Zoopla", color: "text-purple-600" },
  { name: "OnTheMarket", color: "text-green-600" },
];

const pipelineDeals = [
  { name: "14 Lomax House, Blackburn", status: "green", img: propertyImages[0] },
  { name: "Osmaston Road, Derby", status: "orange", img: propertyImages[3] },
  { name: "Willenhall Portfolio", status: "green", img: propertyImages[6] },
];

function PipelineFlow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="hidden lg:flex items-center justify-center gap-6 mt-12 relative"
    >
      {/* 3x3 blurred property grid */}
      <div className="grid grid-cols-3 gap-1.5 shrink-0">
        {propertyImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="w-[72px] h-[56px] object-cover rounded-lg grayscale blur-[1px] opacity-60"
          />
        ))}
      </div>

      {/* Dashed line → */}
      <div className="flex items-center gap-0">
        <div className="w-10 border-t-[1.5px] border-dashed border-[hsl(var(--border))]" />
        <ArrowRight className="h-4 w-4 text-primary -ml-1" />
      </div>

      {/* Portal logos */}
      <div className="flex flex-col items-center gap-2 relative">
        {portals.map((p, i) => (
          <div key={p.name} className="relative">
            <span
              className={`text-xs font-bold ${p.color} bg-white rounded-full px-3 py-1 shadow-sm border border-slate-100`}
            >
              {p.name}
            </span>
            {i < portals.length - 1 && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-px h-2 border-l-[1.5px] border-dashed border-[hsl(var(--border))]" />
            )}
          </div>
        ))}
      </div>

      {/* Dashed line → */}
      <div className="flex items-center gap-0">
        <div className="w-8 border-t-[1.5px] border-dashed border-[hsl(var(--border))]" />
        <ArrowRight className="h-4 w-4 text-primary -ml-1" />
      </div>

      {/* Add to Pipeline button */}
      <button className="bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow shrink-0">
        <Zap className="h-4 w-4" />
        Add to Pipeline
      </button>

      {/* Dashed line → */}
      <div className="flex items-center gap-0">
        <div className="w-8 border-t-[1.5px] border-dashed border-[hsl(var(--border))]" />
        <ArrowRight className="h-4 w-4 text-primary -ml-1" />
      </div>

      {/* Pipeline panel */}
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-4 w-[250px] shrink-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Deals in Your Pipeline
        </p>
        <div className="space-y-2.5">
          {pipelineDeals.map((deal) => (
            <div key={deal.name} className="flex items-center gap-2.5">
              <img
                src={deal.img}
                alt=""
                className="w-8 h-8 rounded-md object-cover"
              />
              <span className="text-xs text-foreground font-medium truncate flex-1">
                {deal.name}
              </span>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  deal.status === "green" ? "bg-green-500" : "bg-orange-400"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Hero ── */

export function HeroSection() {
  return (
    <>
      <section className="relative overflow-hidden bg-[hsl(210,33%,96%)] min-h-[85vh] flex flex-col justify-center">
        <div className="container relative py-16 lg:py-24">
          {/* Floating cards (desktop only, absolutely positioned) */}
          <FloatingCardNewDeal />
          <FloatingCardVerified />
          <FloatingCardToggles />
          <FloatingCardMarket />

          {/* Centre content */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-5 text-foreground"
            >
              Off-market deals,{" "}
              <span className="text-primary">before anyone else.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl"
            >
              We connect property sellers with serious investors. No estate
              agents, no bidding wars — just verified deals with transparent
              returns.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 mb-4"
            >
              <Button
                asChild
                size="lg"
                className="font-semibold text-base px-8 group bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/register">
                  I Want to Invest
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-semibold text-base px-8 bg-white border-border text-foreground hover:bg-accent"
              >
                <Link to="/submit-property">I Want to Sell</Link>
              </Button>
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xs text-muted-foreground"
            >
              GDPR Compliant · No credit card required · No estate agent fees
            </motion.p>

            {/* Mobile floating cards */}
            <MobileFloatingCards />
          </div>

          {/* Pipeline flow (lg only) */}
          <PipelineFlow />
        </div>
      </section>

      {/* Logo bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-background border-b border-border py-6"
      >
        <div className="container flex flex-col items-center gap-3">
          <p className="text-xs text-muted-foreground tracking-wide uppercase">
            Trusted by investors across the UK
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
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
