import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Blue glow at top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/30 via-primary/10 to-transparent rounded-full blur-3xl" />
        
        {/* Subtle side glows */}
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-foreground">Take Control of Your</span>
            <br />
            <span className="text-primary">Property Investments</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            InvestorHub offers a seamless, secure experience for off-market property deals. 
            Every buyer vetted. Every property screened.
          </p>

          {/* Single CTA */}
          <Button 
            asChild 
            size="lg" 
            className="text-base px-8 py-6 font-semibold group shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
          >
            <Link to="/register">
              Get started now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Trust indicator */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">They trust us</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">4.9</span>
          </div>
        </div>
      </div>
    </section>
  );
}
