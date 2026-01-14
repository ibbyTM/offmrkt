import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    description: "Perfect for exploring",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Browse available properties",
      "Basic property analytics",
      "Email notifications",
      "Community access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    description: "For serious investors",
    monthlyPrice: 29,
    yearlyPrice: 20,
    features: [
      "Everything in Free",
      "Priority deal access",
      "Advanced ROI calculator",
      "Instant notifications",
      "1-on-1 support calls",
      "Property comparison tools",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Premium",
    description: "For portfolio builders",
    monthlyPrice: 49,
    yearlyPrice: 34,
    features: [
      "Everything in Pro",
      "First access to all deals",
      "Dedicated account manager",
      "Portfolio analytics dashboard",
      "Exclusive off-market deals",
      "Mortgage broker referrals",
      "Legal document templates",
    ],
    cta: "Go Premium",
    popular: false,
  },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose the perfect plan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include access to our 
            verified property marketplace.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Annually
          </span>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Save 30%
          </Badge>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-4">
                    Recommended
                  </Badge>
                </div>
              )}
              
              <Card className={`p-6 h-full border-border bg-card hover:shadow-lg transition-shadow ${plan.popular ? "border-primary/50 shadow-lg" : ""}`}>
                {/* Plan header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      £{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {isYearly && plan.monthlyPrice > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed annually
                    </p>
                  )}
                </div>
                
                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA */}
                <Button 
                  asChild 
                  className={`w-full group ${plan.popular ? "" : "variant-outline"}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link to="/register">
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
