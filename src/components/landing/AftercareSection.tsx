import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClipboardList, Hammer, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const services = [
  {
    icon: "£",
    title: "Mortgage Finance",
    description: "Get competitive rates from our trusted mortgage partner. Expert advice tailored to buy-to-let and investment mortgages.",
    features: ["Buy-to-let specialists", "Whole of market access", "Fast decisions"],
    cta: "Speak to a Broker",
    href: "/mortgage",
  },
  {
    icon: ClipboardList,
    title: "Project Management",
    description: "End-to-end project oversight for your property investments. From purchase coordination through to tenant move-in.",
    features: ["Purchase coordination", "Contractor management", "Timeline tracking"],
    cta: "Learn More",
    href: "#contact",
  },
  {
    icon: Hammer,
    title: "Renovations & Refurb",
    description: "Transform properties with our vetted contractor network. HMO conversions, full refurbs, and cosmetic upgrades.",
    features: ["HMO conversions", "Full refurbishments", "Cosmetic upgrades"],
    cta: "Get a Quote",
    href: "#contact",
  },
];

export function AftercareSection() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Need Support Beyond the Purchase?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're with you every step of the way — from financing to renovation.
            Our trusted partners help you maximise your investment.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <Card className="p-6 h-full border-border bg-card hover:shadow-lg transition-shadow flex flex-col">
                {/* Icon — inline, no circle wrapper */}
                {typeof service.icon === "string" ? (
                  <span className="text-2xl font-bold text-primary mb-4">{service.icon}</span>
                ) : (
                  <service.icon className="w-6 h-6 text-primary mb-4" />
                )}

                <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild variant="outline" className="w-full group">
                  <Link to={service.href}>
                    {service.cta}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
