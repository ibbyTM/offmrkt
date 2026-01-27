import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Zap, Shield, Clock, TrendingUp, Award, Heart } from 'lucide-react';

interface Benefit {
  icon?: ReactNode;
  title: string;
  description: string;
}

interface FunnelBenefitsProps {
  title?: string;
  subtitle?: string;
  benefits: Benefit[];
  variant?: 'grid' | 'list' | 'cards';
  columns?: 2 | 3 | 4;
  className?: string;
}

const iconMap: Record<string, ReactNode> = {
  check: <Check className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  shield: <Shield className="h-6 w-6" />,
  clock: <Clock className="h-6 w-6" />,
  trending: <TrendingUp className="h-6 w-6" />,
  award: <Award className="h-6 w-6" />,
  heart: <Heart className="h-6 w-6" />,
};

const defaultSellerBenefits: Benefit[] = [
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Sell in Days, Not Months',
    description: 'Complete your sale in as little as 7 days, not the typical 3-6 months.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'No Fees or Commissions',
    description: 'Keep more of your money. We don\'t charge any agent fees or hidden costs.',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Guaranteed Cash Offer',
    description: 'No chain, no mortgage delays. Get a cash offer within 24 hours.',
  },
  {
    icon: <Check className="h-6 w-6" />,
    title: 'Sell As-Is',
    description: 'No repairs, cleaning, or viewings needed. We buy properties in any condition.',
  },
];

export function FunnelBenefits({
  title = 'Why Choose Us',
  subtitle,
  benefits = defaultSellerBenefits,
  variant = 'grid',
  columns = 2,
  className,
}: FunnelBenefitsProps) {
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

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  if (variant === 'list') {
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
            className="max-w-2xl mx-auto space-y-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                  {benefit.icon || <Check className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  if (variant === 'cards') {
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
            className={cn('grid gap-6', gridCols[columns])}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                  {benefit.icon || <Check className="h-6 w-6" />}
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  // Grid variant (default)
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
          className={cn('grid gap-8', gridCols[columns])}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <div className="p-4 rounded-full bg-primary/10 text-primary w-fit mx-auto mb-4">
                {benefit.icon || <Check className="h-6 w-6" />}
              </div>
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export { defaultSellerBenefits };
