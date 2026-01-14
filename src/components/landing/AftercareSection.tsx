import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, ClipboardList, Hammer, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Building2,
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

        {/* Service cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="p-6 h-full border-border bg-card hover:shadow-lg transition-shadow flex flex-col">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Title & description */}
                <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button asChild variant="outline" className="w-full group">
                  <Link to={service.href}>
                    {service.cta}
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
