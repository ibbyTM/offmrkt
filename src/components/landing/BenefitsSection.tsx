import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArrowRight, Building2, PieChart, Bell, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Building2,
    title: "Curated Property Deals",
    description: "Access hand-picked investment properties with verified returns and transparent pricing.",
    stat: "510+",
    statLabel: "Active Deals",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: PieChart,
    title: "Investment Analytics",
    description: "Detailed ROI calculations, yield projections, and market comparisons for every property.",
    stat: "£517K",
    statLabel: "Avg Property Value",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Be the first to know about new deals matching your investment criteria.",
    stat: "24h",
    statLabel: "Early Access",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Shield,
    title: "Verified Sellers",
    description: "All sellers are verified and properties undergo thorough due diligence.",
    stat: "100%",
    statLabel: "Verified",
    color: "bg-orange-50 text-orange-600",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore our top features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simplify your property investment journey with powerful tools designed 
            to help you find, analyze, and secure the best deals.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow border-border bg-card group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  
                  {/* Stat badge */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{feature.stat}</div>
                    <div className="text-xs text-muted-foreground">{feature.statLabel}</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                
                <Link 
                  to="/properties" 
                  className="inline-flex items-center text-primary font-medium text-sm group-hover:gap-2 gap-1 transition-all"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
