import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FeaturedPropertyCard } from "./FeaturedPropertyCard";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/40 pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/60 to-transparent rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="max-w-xl">
            {/* Subtle badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary font-medium">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Exclusive access for verified investors
            </div>

            {/* Main headline */}
            <h1 className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Off-market
              <span className="block text-primary">investment properties</span>
            </h1>

            {/* Subheadline */}
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              The marketplace connecting verified investors with quality investment properties. Every buyer vetted. Every property screened.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base px-8 font-semibold group shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <Link to="/properties">
                  Browse Available Deals
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base px-8 font-semibold border-border/60 hover:bg-accent hover:border-primary/30">
                <Link to="/register">
                  Join as Investor
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Featured Property */}
          <div className="lg:pl-8">
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/30 rounded-3xl blur-2xl opacity-60" />
              
              {/* Card with slight rotation */}
              <div className="relative transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                <FeaturedPropertyCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
