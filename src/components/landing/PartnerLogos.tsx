import { motion } from "framer-motion";

const partners = [
  "PropertyMark",
  "RICS",
  "ARLA",
  "NAEA",
  "The Guild",
  "Rightmove",
];

export function PartnerLogos() {
  return (
    <section className="py-12 bg-muted/30 border-y border-border">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-8">
            Trusted by leading property professionals and organizations
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {partners.map((partner, i) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="text-muted-foreground/50 font-semibold text-lg hover:text-muted-foreground transition-colors"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
