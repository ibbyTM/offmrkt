import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DualPathSection() {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Which describes you best?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Whether you're looking to sell or invest, we've got you covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 max-w-4xl mx-auto">
          {/* Sell Card - Emphasized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-8 border-primary/30 bg-primary/5 relative h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <Badge className="absolute top-4 right-4 bg-primary/10 text-primary border-primary/20">
                <Zap className="h-3 w-3 mr-1" />
                Quick Cash
              </Badge>
              
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Home className="h-7 w-7 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-3">
                I Want to Sell
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Get instant cash offers from our network of verified investors. 
                No estate agent fees, no chains, fast completions.
              </p>
              
              <ul className="space-y-2 mb-6 text-sm">
                {["Cash offers within 24 hours", "No fees or commissions", "Complete in as little as 7 days"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <Button asChild variant="gradient" size="lg" className="w-full group">
                <Link to="/submit-property">
                  Submit Your Property
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </Card>
          </motion.div>

          {/* Buy Card - Secondary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8 border-border h-full hover:border-primary/30 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-5">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-3">
                I Want to Buy
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Access exclusive off-market deals before anyone else. 
                Verified opportunities with full investment analysis.
              </p>
              
              <ul className="space-y-2 mb-6 text-sm">
                {["Exclusive off-market deals", "Full investment analysis", "High-yield opportunities"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link to="/register">
                  Browse Deals
                </Link>
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
