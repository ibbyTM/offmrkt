import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Users } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* For Investors */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-8 md:p-12">
            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
                For Investors
              </h3>
              <p className="mb-6 text-muted-foreground max-w-md">
                Access vetted investment opportunities, detailed ROI analysis, and a network of 
                professional service providers. Get verified to start reserving deals.
              </p>
              <ul className="mb-8 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Pre-screened investment properties
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Multiple investment strategy analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Reserve deals with refundable deposits
                </li>
              </ul>
              <Button size="lg" asChild>
                <Link to="/register">
                  Get Started as Investor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* For Sellers */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12">
            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-foreground">
                <Building className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
                For Property Sellers
              </h3>
              <p className="mb-6 text-muted-foreground max-w-md">
                List your investment property and connect with verified, qualified buyers. 
                No time wasters — only serious investors with proof of funds.
              </p>
              <ul className="mb-8 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  Access to 500+ verified investors
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  Fast, streamlined sales process
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  Professional property presentation
                </li>
              </ul>
              <Button size="lg" variant="outline" asChild>
                <Link to="/submit-property">
                  Submit Your Property
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
