import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Building,
  Warehouse,
  Repeat,
  Landmark,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FunnelLayout } from '@/components/funnels/FunnelLayout';
import { FunnelHero } from '@/components/funnels/FunnelHero';
import { FunnelBenefits, defaultInvestorBenefits } from '@/components/funnels/FunnelBenefits';

import { FunnelCTA } from '@/components/funnels/FunnelCTA';
import { FunnelLeadForm } from '@/components/funnels/FunnelLeadForm';
import { FunnelSteps } from '@/components/funnels/FunnelSteps';
import { useFunnel } from '@/contexts/FunnelContext';
import { useFunnelTracking } from '@/hooks/useFunnelTracking';

interface InvestFunnelV1Props {
  config?: {
    id: string;
    slug: string;
    name: string;
    type: string;
    variant: string;
    config: Record<string, any>;
  };
}

const investmentStrategies = [
  { value: 'btl', label: 'Buy-to-Let', icon: Home },
  { value: 'hmo', label: 'HMO', icon: Building },
  { value: 'flip', label: 'Flip / Refurb', icon: Warehouse },
  { value: 'brrr', label: 'BRRR', icon: Repeat },
  { value: 'commercial', label: 'Commercial', icon: Landmark },
  { value: 'portfolio', label: 'Portfolio', icon: Layers },
];

const steps = [
  { title: 'Strategy' },
  { title: 'Criteria' },
  { title: 'Your Info' },
  { title: 'Done' },
];

export default function InvestFunnelV1({ config }: InvestFunnelV1Props) {
  const navigate = useNavigate();
  const {
    currentStep,
    setTotalSteps,
    formData,
    updateFormData,
    nextStep,
  } = useFunnel();
  const { trackStepComplete } = useFunnelTracking();

  useState(() => {
    setTotalSteps(4);
  });

  const funnelConfig = config?.config || {};
  const headline =
    funnelConfig.headline || 'Access Off-Market Deals Before Anyone Else';
  const subheadline =
    funnelConfig.subheadline ||
    'High-yield investment properties sourced, analysed, and ready to go.';
  const ctaText = funnelConfig.ctaText || 'Join Our Investor List';

  const handleStrategySelect = (strategy: string) => {
    updateFormData({ investmentStrategy: strategy });
    trackStepComplete(1, { investmentStrategy: strategy });
    nextStep();
  };

  const handleCriteriaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackStepComplete(2, formData);
    nextStep();
  };

  const handleLeadSuccess = (leadId: string) => {
    updateFormData({ leadId });
    trackStepComplete(3, { leadId });
    nextStep();
  };

  const scrollToForm = () => {
    const el = document.getElementById('funnel-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Step 1: Strategy Selection
  if (currentStep === 1) {
    return (
      <FunnelLayout showProgress showBackButton={false}>
        <FunnelHero
          headline={headline}
          subheadline={subheadline}
          ctaText={ctaText}
          ctaAction={scrollToForm}
          testimonial={{
            quote: 'Found a 12% yield deal within a week of signing up!',
            author: 'James R.',
            location: 'Birmingham',
            rating: 5,
          }}
        />

        <section id="funnel-form" className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-2">
                What type of investment are you looking for?
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Select your preferred strategy to get started
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {investmentStrategies.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.button
                      key={s.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStrategySelect(s.value)}
                      className={cn(
                        'p-6 rounded-xl border-2 text-center transition-all',
                        'hover:border-primary hover:bg-primary/5',
                        formData.investmentStrategy === s.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-background'
                      )}
                    >
                      <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <span className="font-medium text-sm">{s.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <FunnelBenefits
          benefits={defaultInvestorBenefits}
          variant="cards"
          columns={4}
        />
        <FunnelCTA
          headline="Ready to Access Off-Market Deals?"
          subheadline="Join verified investors already accessing exclusive UK off-market deals."
          ctaText="Get Early Access"
          ctaAction={scrollToForm}
          variant="gradient"
        />
      </FunnelLayout>
    );
  }

  // Step 2: Investment Criteria
  if (currentStep === 2) {
    return (
      <FunnelLayout showProgress showBackButton>
        <div className="flex-1 flex items-center py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <FunnelSteps
                steps={steps}
                currentStep={currentStep}
                variant="compact"
                className="mb-8"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    Tell us your investment criteria
                  </h2>
                  <p className="text-muted-foreground">
                    So we can match you with the best deals
                  </p>
                </div>

                <form onSubmit={handleCriteriaSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select
                      value={formData.budget || ''}
                      onValueChange={(v) => updateFormData({ budget: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_50k">Under £50k</SelectItem>
                        <SelectItem value="50k_100k">£50k – £100k</SelectItem>
                        <SelectItem value="100k_200k">£100k – £200k</SelectItem>
                        <SelectItem value="200k_plus">£200k+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetYield">Target Yield</Label>
                    <Select
                      value={formData.targetYield || ''}
                      onValueChange={(v) => updateFormData({ targetYield: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select target yield" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6_plus">6%+</SelectItem>
                        <SelectItem value="8_plus">8%+</SelectItem>
                        <SelectItem value="10_plus">10%+</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Preferred Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Manchester, Birmingham"
                      value={formData.location || ''}
                      onChange={(e) =>
                        updateFormData({ location: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Purchase Timeline</Label>
                    <Select
                      value={formData.timeline || ''}
                      onValueChange={(v) => updateFormData({ timeline: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">As soon as possible</SelectItem>
                        <SelectItem value="1month">Within 1 month</SelectItem>
                        <SelectItem value="3months">Within 3 months</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" size="lg" className="w-full text-lg">
                    Continue
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </FunnelLayout>
    );
  }

  // Step 3: Contact Details
  if (currentStep === 3) {
    return (
      <FunnelLayout showProgress showBackButton>
        <div className="flex-1 flex items-center py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <FunnelSteps
                steps={steps}
                currentStep={currentStep}
                variant="compact"
                className="mb-8"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    Where should we send deal alerts?
                  </h2>
                  <p className="text-muted-foreground">
                    Get notified first when new deals match your criteria
                  </p>
                </div>

                <FunnelLeadForm
                  submitLabel="Get Early Access to Deals"
                  onSuccess={handleLeadSuccess}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </FunnelLayout>
    );
  }

  // Step 4: Confirmation
  return (
    <FunnelLayout showProgress={false} showBackButton={false}>
      <div className="flex-1 flex items-center py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-10 h-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </div>

            <h1 className="text-3xl font-bold mb-4">You're on the List!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              We'll send you exclusive off-market deals that match your
              investment criteria as soon as they become available.
            </p>

            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-4">What happens next?</h3>
              <ol className="text-left space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>We'll review your investment criteria</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>
                    You'll receive deal alerts matching your preferences
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>
                    Reserve deals before they hit the open market
                  </span>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
              <Button onClick={() => navigate('/properties')}>
                Browse Current Deals
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </FunnelLayout>
  );
}
