import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Clock, CheckCircle2 } from 'lucide-react';

interface TrustBadge {
  icon?: ReactNode;
  text: string;
}

interface FunnelHeroProps {
  headline: string;
  subheadline: string;
  heroImage?: string;
  ctaText?: string;
  ctaAction?: () => void;
  secondaryCta?: {
    text: string;
    action: () => void;
  };
  trustBadges?: TrustBadge[];
  testimonial?: {
    quote: string;
    author: string;
    location?: string;
    rating?: number;
  };
  children?: ReactNode;
  className?: string;
  variant?: 'centered' | 'split';
}

const defaultTrustBadges: TrustBadge[] = [
  { icon: <Shield className="h-4 w-4" />, text: 'No Fees' },
  { icon: <Clock className="h-4 w-4" />, text: '24hr Response' },
  { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Guaranteed Offer' },
];

export function FunnelHero({
  headline,
  subheadline,
  heroImage,
  ctaText = 'Get Started',
  ctaAction,
  secondaryCta,
  trustBadges = defaultTrustBadges,
  testimonial,
  children,
  className,
  variant = 'centered',
}: FunnelHeroProps) {
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

  if (variant === 'split') {
    return (
      <section className={cn('py-12 lg:py-20', className)}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                {headline}
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg sm:text-xl text-muted-foreground"
              >
                {subheadline}
              </motion.p>

              {/* Trust Badges */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                {trustBadges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="py-1.5 px-3 text-sm gap-1.5"
                  >
                    {badge.icon}
                    {badge.text}
                  </Badge>
                ))}
              </motion.div>

              {/* Form or CTA */}
              {children ? (
                <motion.div variants={itemVariants}>{children}</motion.div>
              ) : (
                <motion.div variants={itemVariants} className="flex gap-4">
                  <Button size="lg" onClick={ctaAction} className="text-lg px-8">
                    {ctaText}
                  </Button>
                  {secondaryCta && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={secondaryCta.action}
                    >
                      {secondaryCta.text}
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Testimonial */}
              {testimonial && (
                <motion.div
                  variants={itemVariants}
                  className="pt-6 border-t"
                >
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-sm font-medium mt-2">
                    — {testimonial.author}
                    {testimonial.location && (
                      <span className="text-muted-foreground">
                        , {testimonial.location}
                      </span>
                    )}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Hero Image */}
            {heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <img
                  src={heroImage}
                  alt="Property"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Centered variant (default)
  return (
    <section className={cn('py-16 lg:py-24', className)}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            {headline}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground"
          >
            {subheadline}
          </motion.p>

          {/* Trust Badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3"
          >
            {trustBadges.map((badge, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="py-1.5 px-3 text-sm gap-1.5"
              >
                {badge.icon}
                {badge.text}
              </Badge>
            ))}
          </motion.div>

          {/* Form or CTA */}
          {children ? (
            <motion.div variants={itemVariants} className="max-w-md mx-auto">
              {children}
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="flex justify-center gap-4">
              <Button size="lg" onClick={ctaAction} className="text-lg px-8">
                {ctaText}
              </Button>
              {secondaryCta && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={secondaryCta.action}
                >
                  {secondaryCta.text}
                </Button>
              )}
            </motion.div>
          )}

          {/* Testimonial */}
          {testimonial && (
            <motion.div variants={itemVariants} className="pt-8">
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground italic text-lg">
                "{testimonial.quote}"
              </p>
              <p className="text-sm font-medium mt-2">
                — {testimonial.author}
                {testimonial.location && (
                  <span className="text-muted-foreground">
                    , {testimonial.location}
                  </span>
                )}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
