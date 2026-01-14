import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Zap, Award } from "lucide-react";
import { Link } from "react-router-dom";

const reasons = [
  {
    icon: Target,
    title: "Personalized Property Matching",
    description: "Our smart matching system learns your investment preferences and budget to surface the most relevant opportunities. Get deals tailored specifically to your portfolio goals.",
    image: "bg-gradient-to-br from-blue-100 to-blue-50",
  },
  {
    icon: Zap,
    title: "Real-time Market Updates",
    description: "Stay ahead with instant notifications on new listings, price changes, and market trends. Never miss a high-yield opportunity again with our real-time alert system.",
    image: "bg-gradient-to-br from-green-100 to-green-50",
  },
  {
    icon: Award,
    title: "Trusted by Top Investors",
    description: "Join thousands of successful property investors who rely on OffMrkt to build their portfolios. Our track record speaks for itself with verified reviews and success stories.",
    image: "bg-gradient-to-br from-purple-100 to-purple-50",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Discover why investors choose us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We've built the most comprehensive platform for off-market property investment 
            in the UK, trusted by over 1,200 active investors.
          </p>
        </motion.div>

        {/* Reasons grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image placeholder */}
              <div className={`h-48 ${reason.image} flex items-center justify-center`}>
                <reason.icon className="w-16 h-16 text-primary/30" />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {reason.description}
                </p>
                
                <Button asChild variant="default" className="w-full group">
                  <Link to="/register">
                    Get Started for Free
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
