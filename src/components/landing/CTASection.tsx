import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background-secondary">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Investor CTA */}
          <div 
            className={cn(
              "relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 text-primary-foreground transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            )}
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            
            <div className="relative">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold md:text-3xl">
                Ready to Invest?
              </h3>
              <p className="mb-8 text-primary-foreground/90 text-lg">
                Join our network of verified investors and get access to exclusive off-market property deals.
              </p>
              <Button 
                asChild 
                size="lg" 
                variant="secondary"
                className="group font-semibold"
              >
                <Link to="/register">
                  Create Investor Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Seller CTA */}
          <div 
            className={cn(
              "relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12 transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}
            style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
            
            <div className="relative">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-primary">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
                Have a Property to Sell?
              </h3>
              <p className="mb-8 text-muted-foreground text-lg">
                Submit your investment property and connect with our network of qualified, ready-to-buy investors.
              </p>
              <Button 
                asChild 
                size="lg" 
                className="group font-semibold"
              >
                <Link to="/submit-property">
                  Submit Your Property
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
