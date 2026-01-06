import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 md:py-24 bg-foreground">
      <div className="container">
        <div 
          className={cn(
            "mx-auto max-w-2xl text-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="mb-4 text-3xl font-bold text-background sm:text-4xl">
            Ready to find your next investment?
          </h2>
          <p className="mb-8 text-background/70 text-lg">
            Join our network of verified investors and access exclusive off-market deals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="font-semibold group"
            >
              <Link to="/register">
                Create Investor Account
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="font-semibold border-background/30 text-background hover:bg-background/10 hover:text-background"
            >
              <Link to="/submit-property">
                Submit a Property
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
