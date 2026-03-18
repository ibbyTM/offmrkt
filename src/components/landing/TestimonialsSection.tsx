import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "James M.",
    role: "Portfolio investor",
    rating: 5,
    quote:
      "Found my first BTL within a week of signing up. The analytics made it easy to compare yields across cities.",
  },
  {
    name: "Sarah W.",
    role: "First-time investor",
    rating: 5,
    quote:
      "As a first-time investor, the support was invaluable. They connected me with a solicitor and mortgage broker in 24 hours.",
  },
  {
    name: "David C.",
    role: "HMO investor",
    rating: 5,
    quote:
      "Built a portfolio of 6 properties in under 2 years. The early access to deals is a genuine advantage.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What investors say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-foreground text-base leading-relaxed mb-6 flex-1">
                "{t.quote}"
              </p>

              <footer>
                <div className="font-semibold text-foreground text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
