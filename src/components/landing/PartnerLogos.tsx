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
    <section className="py-16 bg-muted/30 border-y border-border">
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
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {partners.map((partner, i) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="h-10 px-5 flex items-center justify-center bg-background rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <span className="font-bold text-muted-foreground/60 text-sm tracking-wide">
                  {partner}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
