import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FeaturedPropertyCard } from "./FeaturedPropertyCard";

export function HeroSection() {
  return (
    <section className="relative bg-background pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className="max-w-xl">
            {/* Subtle badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background-secondary px-4 py-1.5 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Exclusive access for verified investors
            </div>

            {/* Main headline */}
            <h1 className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Off-market investment properties
            </h1>

            {/* Subheadline */}
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              The marketplace connecting verified investors with quality investment properties. Every buyer vetted. Every property screened.
            </p>

            {/* Single CTA */}
            <Button asChild size="lg" className="text-base px-8 font-semibold group">
              <Link to="/properties">
                Browse Available Deals
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Right - Featured Property */}
          <div className="lg:pl-8">
            <FeaturedPropertyCard />
          </div>
        </div>
      </div>
    </section>
  );
}
