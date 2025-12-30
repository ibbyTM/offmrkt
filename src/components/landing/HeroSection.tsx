import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28 lg:py-36">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-background" />
      
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground animate-fade-in">
            <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
            Trusted by 500+ verified investors
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Connect with vetted{" "}
            <span className="text-primary">investment property</span>{" "}
            deals
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            The marketplace for serious property investors. Access off-market deals, 
            verified sellers, and comprehensive due diligence — all in one platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
              <Link to="/properties">
                Browse Available Deals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8" asChild>
              <Link to="/submit-property">
                Submit Your Property
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div>
              <div className="text-3xl font-bold text-foreground">£50M+</div>
              <div className="text-sm text-muted-foreground">Properties Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Active Investors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
