import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  location?: string;
  rating?: number;
  avatar?: string;
}

interface FunnelTestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  variant?: 'cards' | 'simple' | 'featured';
  className?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    quote: "Sold my property in just 5 days. No stress, no hassle. The team was professional and kept me informed throughout.",
    author: "Sarah Thompson",
    location: "Manchester",
    rating: 5,
  },
  {
    quote: "After months on the market with no offers, Off The Markets gave me a fair cash offer and completed within 2 weeks.",
    author: "James Wilson",
    location: "Birmingham",
    rating: 5,
  },
  {
    quote: "As a landlord looking to exit, this was the perfect solution. No need to deal with tenants or repairs.",
    author: "Michael Chen",
    location: "Leeds",
    rating: 5,
  },
];

export function FunnelTestimonials({
  title = "What Our Clients Say",
  subtitle,
  testimonials = defaultTestimonials,
  variant = 'cards',
  className,
}: FunnelTestimonialsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderStars = (rating: number = 5) => (
    <div className="flex gap-0.5">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );

  if (variant === 'featured' && testimonials.length > 0) {
    const featured = testimonials[0];
    const others = testimonials.slice(1);

    return (
      <section className={cn('py-16 bg-muted/30', className)}>
        <div className="container mx-auto px-4">
          {(title || subtitle) && (
            <div className="text-center mb-12">
              {title && <h2 className="text-3xl font-bold mb-3">{title}</h2>}
              {subtitle && (
                <p className="text-lg text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Featured testimonial */}
            <motion.div variants={itemVariants}>
              <Card className="max-w-3xl mx-auto border-2">
                <CardContent className="p-8 text-center">
                  <Quote className="h-10 w-10 text-primary/20 mx-auto mb-4" />
                  <p className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                    "{featured.quote}"
                  </p>
                  <div className="flex justify-center mb-3">
                    {renderStars(featured.rating)}
                  </div>
                  <p className="font-semibold">{featured.author}</p>
                  {featured.location && (
                    <p className="text-sm text-muted-foreground">
                      {featured.location}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Other testimonials */}
            {others.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map((testimonial, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="mb-3">{renderStars(testimonial.rating)}</div>
                        <p className="text-muted-foreground mb-4">
                          "{testimonial.quote}"
                        </p>
                        <div>
                          <p className="font-medium text-sm">{testimonial.author}</p>
                          {testimonial.location && (
                            <p className="text-xs text-muted-foreground">
                              {testimonial.location}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  if (variant === 'simple') {
    return (
      <section className={cn('py-12', className)}>
        <div className="container mx-auto px-4">
          {(title || subtitle) && (
            <div className="text-center mb-10">
              {title && <h2 className="text-3xl font-bold mb-3">{title}</h2>}
              {subtitle && (
                <p className="text-lg text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-lg italic text-muted-foreground mb-3">
                  "{testimonial.quote}"
                </p>
                <p className="font-medium">
                  — {testimonial.author}
                  {testimonial.location && (
                    <span className="text-muted-foreground">
                      , {testimonial.location}
                    </span>
                  )}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  // Cards variant (default)
  return (
    <section className={cn('py-16 bg-muted/30', className)}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold mb-3">{title}</h2>}
            {subtitle && (
              <p className="text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-3">{renderStars(testimonial.rating)}</div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {testimonial.author.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{testimonial.author}</p>
                      {testimonial.location && (
                        <p className="text-xs text-muted-foreground">
                          {testimonial.location}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export { defaultTestimonials };
