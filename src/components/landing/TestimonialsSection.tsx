import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Star, Users } from "lucide-react";

const testimonials = [
  {
    name: "James Mitchell",
    handle: "@JamesMitchell",
    avatar: "JM",
    rating: 5,
    quote: "OffMrkt completely changed how I approach property investment. Found my first BTL within a week of signing up.",
  },
  {
    name: "Sarah Williams",
    handle: "@SarahW_Invest",
    avatar: "SW",
    rating: 5,
    quote: "The quality of deals here is incredible. Every property comes with detailed analytics that make decision-making so much easier.",
  },
  {
    name: "David Chen",
    handle: "@DavidChenProp",
    avatar: "DC",
    rating: 5,
    quote: "I've built a portfolio of 6 properties in under 2 years using OffMrkt. The early access to deals is a game-changer.",
  },
  {
    name: "Emma Thompson",
    handle: "@EmmaT_Landlord",
    avatar: "ET",
    rating: 5,
    quote: "As a first-time investor, the support from the OffMrkt team was invaluable. They guided me through every step.",
  },
  {
    name: "Michael Roberts",
    handle: "@MRoberts_Inv",
    avatar: "MR",
    rating: 5,
    quote: "The yield calculations and ROI projections are spot-on. I've seen exactly the returns that were projected on my properties.",
  },
  {
    name: "Lisa Anderson",
    handle: "@LisaAnderson",
    avatar: "LA",
    rating: 5,
    quote: "Transparent pricing, verified sellers, and no hidden fees. Finally a platform that respects investors' time and money.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
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
            Customers love our platform
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied investors who have found their perfect 
            properties through OffMrkt.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="p-6 h-full border-border bg-card hover:shadow-lg transition-shadow">
                {/* Header with avatar and rating */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.handle}</div>
                    </div>
                  </div>
                  <StarRating rating={testimonial.rating} />
                </div>
                
                {/* Quote */}
                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border shadow-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center"
                >
                  <Users className="w-3 h-3 text-primary" />
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="font-semibold text-foreground">Trusted by 1,200+</span>
              <span className="text-muted-foreground"> property investors</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
