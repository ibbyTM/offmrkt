import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

// Dashboard mockup component
function DashboardMockup() {
  return (
    <div className="relative">
      {/* Browser frame */}
      <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Browser header */}
        <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-background rounded-md px-3 py-1.5 text-xs text-muted-foreground max-w-xs mx-auto">
              offmrkt.lovable.app/dashboard
            </div>
          </div>
        </div>
        
        {/* Dashboard content */}
        <div className="p-6 bg-background">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-accent/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-foreground">£2.4M</div>
              <div className="text-xs text-muted-foreground">Portfolio Value</div>
            </div>
            <div className="bg-accent/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-primary">8.2%</div>
              <div className="text-xs text-muted-foreground">Avg Yield</div>
            </div>
            <div className="bg-accent/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-foreground">12</div>
              <div className="text-xs text-muted-foreground">Properties</div>
            </div>
          </div>
          
          {/* Chart placeholder */}
          <div className="bg-muted/30 rounded-xl p-4 mb-4">
            <div className="flex items-end justify-between h-24 gap-2">
              {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/20 rounded-t-sm"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          
          {/* Recent deals */}
          <div className="space-y-2">
            {[
              { city: "Manchester", price: "£185,000", yield: "7.8%" },
              { city: "Liverpool", price: "£145,000", yield: "8.5%" },
            ].map((deal, i) => (
              <div key={i} className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{deal.city}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">{deal.price}</div>
                  <div className="text-xs text-primary">{deal.yield} yield</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-lg border border-border px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">+23%</div>
            <div className="text-xs text-muted-foreground">ROI this year</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-background">
      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />
      
      <div className="container relative py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Find your perfect{" "}
              <span className="text-primary">investment property</span>{" "}
              with our easy platform
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Access exclusive off-market property deals across the UK. Our platform connects 
              verified investors with high-yield opportunities that aren't available anywhere else.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button asChild size="lg" className="font-semibold text-base px-8 group">
                <Link to="/register">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold text-base px-8">
                <Link to="/properties">
                  Browse Properties
                </Link>
              </Button>
            </div>
            
            {/* Trust indicator */}
            <div className="flex items-center gap-2 text-muted-foreground">
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
          
          {/* Right content - Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block"
          >
            <DashboardMockup />
          </motion.div>
        </div>
        
        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-3 gap-6 mt-16 pt-10 border-t border-border"
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
        
        {/* Mobile dashboard preview */}
        <div className="lg:hidden mt-12">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
