import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, TrendingUp, Users, Bell } from "lucide-react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

// Laptop mockup with scroll-driven parallax effect
function LaptopMockup({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Map scroll progress: starts flat (35°), rises to fully vertical (0°)
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [35, 0]);
  // More dramatic lift as it rotates upright
  const translateY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  // Scale up as it rises
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
  // Shadow responds to the lift
  const shadowScale = useTransform(scrollYProgress, [0, 0.5], [1.4, 0.8]);
  const shadowBlur = useTransform(scrollYProgress, [0, 0.5], [40, 20]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.5], [0.08, 0.18]);

  return (
    <div className="relative" style={{ perspective: "1200px" }}>
      {/* Glow effect behind laptop */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 rounded-full scale-90" />
      
      {/* Floating laptop with scroll-driven rotation */}
      <motion.div
        style={{ 
          rotateX, 
          y: translateY, 
          scale,
          transformStyle: "preserve-3d"
        }}
        className="relative"
      >
        {/* Subtle floating animation layered on top */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Laptop screen */}
          <div className="relative">
            {/* Screen bezel */}
            <div className="bg-gray-900 rounded-t-2xl p-2 pt-4 shadow-2xl">
              {/* Camera notch */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-700" />
              
              {/* Screen content */}
              <div className="bg-background rounded-lg overflow-hidden">
                {/* Browser header */}
                <div className="bg-muted/50 px-3 py-2 border-b border-border flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-background rounded px-2 py-0.5 text-[10px] text-muted-foreground max-w-[140px] mx-auto truncate">
                      offmrkt.com/dashboard
                    </div>
                  </div>
                </div>
                
                {/* Dashboard content */}
                <div className="p-4 bg-background">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-accent/50 rounded-lg p-2">
                      <div className="text-lg font-bold text-foreground">£2.4M</div>
                      <div className="text-[9px] text-muted-foreground">Portfolio</div>
                    </div>
                    <div className="bg-accent/50 rounded-lg p-2">
                      <div className="text-lg font-bold text-primary">8.2%</div>
                      <div className="text-[9px] text-muted-foreground">Avg Yield</div>
                    </div>
                    <div className="bg-accent/50 rounded-lg p-2">
                      <div className="text-lg font-bold text-foreground">12</div>
                      <div className="text-[9px] text-muted-foreground">Properties</div>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <div className="bg-muted/30 rounded-lg p-3 mb-3">
                    <div className="flex items-end justify-between h-16 gap-1">
                      {[35, 55, 40, 70, 50, 85, 60, 75, 90, 65].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                          className="flex-1 bg-primary/30 hover:bg-primary/50 transition-colors rounded-t"
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent deals */}
                  <div className="space-y-1.5">
                    {[
                      { city: "Manchester", price: "£185k", yield: "7.8%" },
                      { city: "Liverpool", price: "£145k", yield: "8.5%" },
                    ].map((deal, i) => (
                      <div key={i} className="flex items-center justify-between bg-muted/30 rounded-lg px-2 py-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-2.5 h-2.5 text-primary" />
                          </div>
                          <span className="text-[10px] font-medium text-foreground">{deal.city}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-semibold text-foreground">{deal.price}</div>
                          <div className="text-[8px] text-primary">{deal.yield}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Laptop base/keyboard */}
            <div className="relative">
              <div className="bg-gray-800 h-3 rounded-b-lg" />
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-16 h-1 bg-gray-700 rounded-b" />
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Responsive shadow underneath */}
      <motion.div 
        style={{ 
          scaleX: shadowScale,
          opacity: shadowOpacity,
        }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black blur-2xl rounded-full" 
      />
      
      {/* Floating ROI badge - left */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute -left-4 md:-left-12 top-1/4 z-10"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="bg-card rounded-xl shadow-lg border border-border px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">+23%</div>
              <div className="text-[10px] text-muted-foreground">ROI this year</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Floating notification - right */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -right-4 md:-right-12 top-1/3 z-10"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="bg-card rounded-xl shadow-lg border border-border px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <div className="text-[10px] font-medium text-foreground">New Deal Alert</div>
              <div className="text-[9px] text-muted-foreground">Leeds • 9.2% yield</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Track scroll progress within the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  return (
    <section id="hero" ref={containerRef} className="relative overflow-hidden bg-background">
      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />
      
      <div className="container relative py-8 lg:py-12">
        {/* Centered text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Unlock{" "}
            <span className="text-primary">Off-Market Property Deals</span>{" "}
            Before Anyone Else
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access exclusive off-market property deals across the UK. Our platform connects 
            verified investors with high-yield opportunities that aren't available anywhere else.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
          
          {/* Trust indicator */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center"
                >
                  <Users className="w-3 h-3 text-muted-foreground" />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium">
              Trusted by <span className="text-foreground font-semibold">1,200+</span> investors
            </span>
          </div>
        </motion.div>
        
        {/* Centered floating laptop mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 max-w-2xl mx-auto"
        >
          <LaptopMockup scrollYProgress={scrollYProgress} />
        </motion.div>
        
        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-3 gap-6 mt-20 pt-10 border-t border-border max-w-3xl mx-auto"
        >
          {[
            { value: "500+", label: "Properties Listed" },
            { value: "£50M+", label: "Investment Value" },
            { value: "8.5%", label: "Average Yield" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
