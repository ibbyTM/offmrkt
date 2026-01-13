import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Building2, Users, BarChart3, Home, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000, startAnimation: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, startAnimation]);

  return count;
}

// Floating dashboard card component
function FloatingDashboardCard() {
  const portfolioValue = useAnimatedCounter(847500, 2500);
  const avgYield = useAnimatedCounter(82, 2000); // 8.2% displayed as 82/10
  const propertyCount = useAnimatedCounter(4, 1500);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, rotateY: -15 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="relative"
    >
      {/* Glow effect behind card */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-3xl scale-110" />
      
      {/* Main card */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-card border border-border rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm"
      >
        {/* Card header */}
        <div className="bg-muted/50 px-5 py-3 border-b border-border flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
          <span className="text-xs text-muted-foreground ml-2">Dashboard Preview</span>
        </div>

        {/* Card content */}
        <div className="p-5 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Portfolio</div>
              <div className="text-lg font-bold text-foreground">
                £{portfolioValue.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Avg Yield</div>
              <div className="text-lg font-bold text-primary">
                {(avgYield / 10).toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Properties</div>
              <div className="text-lg font-bold text-foreground">{propertyCount}</div>
            </div>
          </div>

          {/* Mini property cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-transparent border border-border/50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">Victorian Terrace</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>Manchester</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">£185,000</div>
                <div className="text-xs text-success font-medium">8.4% yield</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border/50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/50 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">City Apartment</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>Birmingham</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">£125,000</div>
                <div className="text-xs text-success font-medium">7.8% yield</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Stats badge component
function StatBadge({ 
  icon: Icon, 
  value, 
  label, 
  delay 
}: { 
  icon: React.ElementType; 
  value: string; 
  label: string; 
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-full shadow-sm"
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <div className="text-sm font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const { scrollY } = useScroll();
  
  // Parallax transforms - different speeds for depth effect
  const y1 = useTransform(scrollY, [0, 500], [0, 150]); // Primary orb - slow
  const y2 = useTransform(scrollY, [0, 500], [0, 250]); // Secondary orb - medium
  const gridY = useTransform(scrollY, [0, 500], [0, 50]); // Grid - subtle

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-24 md:pb-24 lg:pt-28 lg:pb-32">
      {/* Animated background elements with parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary gradient orb - animated with parallax */}
        <motion.div
          style={{ y: y1 }}
          animate={{
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/25 via-primary/10 to-transparent rounded-full blur-3xl"
        />
        
        {/* Secondary orb - right side with parallax */}
        <motion.div
          style={{ y: y2 }}
          animate={{
            x: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/15 to-transparent rounded-full blur-3xl"
        />

        {/* Subtle grid pattern with parallax */}
        <motion.div 
          style={{ y: gridY }}
          className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" 
        />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 border border-primary/20 rounded-full"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">Off-Market Investment Deals</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              <span className="text-foreground">Take Control of Your</span>
              <br />
              <span className="text-primary">Property Investments</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
            >
              OffMrkt connects you with vetted off-market property deals. 
              Every buyer verified. Every property screened. Zero hassle.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <Button
                asChild
                size="lg"
                className="text-base px-8 py-6 font-semibold group shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 font-semibold border-2 hover:bg-muted/50"
              >
                <Link to="/properties">
                  Browse Deals
                </Link>
              </Button>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <StatBadge icon={Users} value="1,200+" label="Investors" delay={0.6} />
              <StatBadge icon={Building2} value="200+" label="Properties" delay={0.7} />
              <StatBadge icon={TrendingUp} value="8.2%" label="Avg Yield" delay={0.8} />
            </motion.div>
          </div>

          {/* Right column - Floating Dashboard */}
          <div className="hidden lg:block">
            <FloatingDashboardCard />
          </div>
        </div>

        {/* Mobile dashboard preview */}
        <div className="lg:hidden mt-12">
          <FloatingDashboardCard />
        </div>
      </div>
    </section>
  );
}
