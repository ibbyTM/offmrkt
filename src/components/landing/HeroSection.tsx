import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Users, Building } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-20 md:pt-24 md:pb-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-40 right-20 h-96 w-96 rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-accent/50 blur-3xl" />
      </div>

      {/* Floating property icons */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Building className="absolute top-32 right-[15%] h-8 w-8 text-primary/10 animate-pulse" style={{ animationDelay: "0s" }} />
        <Building className="absolute top-48 left-[10%] h-6 w-6 text-primary/10 animate-pulse" style={{ animationDelay: "1s" }} />
        <Building className="absolute bottom-32 right-[25%] h-10 w-10 text-primary/10 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Trust badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>Trusted by 500+ verified property investors</span>
          </div>

          {/* Main headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Connect with vetted{" "}
            <span className="relative">
              <span className="relative z-10 text-primary">investment property</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary/20 -z-0" />
            </span>{" "}
            deals
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            The exclusive marketplace connecting verified investors with quality off-market properties. 
            Every investor vetted. Every property screened.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="w-full sm:w-auto text-base px-8 group font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
              <Link to="/properties">
                Browse Available Deals
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 font-semibold">
              <Link to="/submit-property">
                Submit Your Property
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Building className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold text-foreground md:text-4xl">150+</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Listings</p>
            </div>
            <div className="text-center border-x border-border">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold text-foreground md:text-4xl">500+</span>
              </div>
              <p className="text-sm text-muted-foreground">Verified Investors</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold text-foreground md:text-4xl">£45M+</span>
              </div>
              <p className="text-sm text-muted-foreground">Deals Completed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
