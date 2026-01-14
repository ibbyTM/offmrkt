import { motion } from "framer-motion";
import { Shield, Clock, TrendingUp, Users } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Verified Deals",
    description: "Every property is vetted for quality and investment potential",
  },
  {
    icon: Clock,
    title: "Quick Access",
    description: "Get notified about new deals before they hit the open market",
  },
  {
    icon: TrendingUp,
    title: "High Yields",
    description: "Average gross yields of 7-10% across our portfolio",
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Dedicated team to guide you through every step",
  },
];

export function TrustSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                <point.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
