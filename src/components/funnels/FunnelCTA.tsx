import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';

interface FunnelCTAProps {
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaAction: () => void;
  secondaryCta?: {
    text: string;
    action: () => void;
    icon?: ReactNode;
  };
  phoneNumber?: string;
  variant?: 'default' | 'gradient' | 'minimal';
  className?: string;
}

export function FunnelCTA({
  headline,
  subheadline,
  ctaText,
  ctaAction,
  secondaryCta,
  phoneNumber,
  variant = 'default',
  className,
}: FunnelCTAProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (variant === 'minimal') {
    return (
      <section className={cn('py-12', className)}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{headline}</h2>
            {subheadline && (
              <p className="text-muted-foreground mb-6">{subheadline}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={ctaAction} className="text-lg">
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {secondaryCta && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={secondaryCta.action}
                >
                  {secondaryCta.icon}
                  {secondaryCta.text}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (variant === 'gradient') {
    return (
      <section
        className={cn(
          'py-16 bg-gradient-to-r from-primary to-primary/80',
          className
        )}
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-primary-foreground"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{headline}</h2>
            {subheadline && (
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                {subheadline}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={ctaAction}
                className="text-lg"
              >
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {phoneNumber && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <a href={`tel:${phoneNumber}`}>
                    <Phone className="mr-2 h-5 w-5" />
                    {phoneNumber}
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <section className={cn('py-16 bg-muted/50', className)}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{headline}</h2>
          {subheadline && (
            <p className="text-lg text-muted-foreground mb-8">{subheadline}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={ctaAction} className="text-lg px-8">
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {secondaryCta && (
              <Button
                size="lg"
                variant="outline"
                onClick={secondaryCta.action}
              >
                {secondaryCta.icon}
                {secondaryCta.text}
              </Button>
            )}
            {phoneNumber && !secondaryCta && (
              <Button size="lg" variant="outline" asChild>
                <a href={`tel:${phoneNumber}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us: {phoneNumber}
                </a>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
