import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Home, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        {/* Subtle pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="container relative">
        <div 
          className={cn(
            "mx-auto max-w-4xl text-center transition-all duration-700 mb-12",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to get started?
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Whether you're selling or investing, we're here to help you make the right move.
          </p>
        </div>
        
        {/* Dual-column layout */}
        <div 
          className={cn(
            "grid md:grid-cols-2 gap-6 max-w-4xl mx-auto transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Sell Card - Primary */}
          <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5">
              <Home className="h-6 w-6 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              Sell Your Property
            </h3>
            
            <p className="text-white/70 mb-6 text-sm leading-relaxed">
              Get cash offers in 24 hours from our verified investors. 
              No fees, no chains, fast completions.
            </p>
            
            <Button 
              asChild 
              size="lg" 
              className="w-full bg-white text-primary hover:bg-white/90 font-bold group"
            >
              <Link to="/submit-property">
                Submit Property
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </Card>

          {/* Buy Card - Secondary */}
          <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
              <TrendingUp className="h-6 w-6 text-white/80" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              Invest in Deals
            </h3>
            
            <p className="text-white/70 mb-6 text-sm leading-relaxed">
              Browse exclusive off-market deals across the UK 
              with full investment analysis included.
            </p>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 font-semibold"
            >
              <Link to="/register">
                Browse Now
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
