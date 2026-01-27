import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Home, Building, Warehouse, ChevronRight } from 'lucide-react';
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
import { FunnelBenefits, defaultSellerBenefits } from '@/components/funnels/FunnelBenefits';
import { FunnelTestimonials, defaultTestimonials } from '@/components/funnels/FunnelTestimonials';
import { FunnelCTA } from '@/components/funnels/FunnelCTA';
import { FunnelLeadForm } from '@/components/funnels/FunnelLeadForm';
import { FunnelSteps } from '@/components/funnels/FunnelSteps';
import { useFunnel } from '@/contexts/FunnelContext';
import { useFunnelTracking } from '@/hooks/useFunnelTracking';

interface SellFunnelV1Props {
  config?: {
    id: string;
    slug: string;
    name: string;
    type: string;
    variant: string;
    config: Record<string, any>;
  };
}

const propertyTypes = [
  { value: 'terraced', label: 'Terraced House', icon: Home },
  { value: 'semi_detached', label: 'Semi-Detached', icon: Home },
  { value: 'detached', label: 'Detached House', icon: Home },
  { value: 'flat', label: 'Flat / Apartment', icon: Building2 },
  { value: 'bungalow', label: 'Bungalow', icon: Home },
  { value: 'hmo', label: 'HMO', icon: Building },
  { value: 'commercial', label: 'Commercial', icon: Warehouse },
];

const steps = [
  { title: 'Property Type' },
  { title: 'Details' },
  { title: 'Your Info' },
  { title: 'Done' },
];

export default function SellFunnelV1({ config }: SellFunnelV1Props) {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    setTotalSteps,
    formData,
    updateFormData,
    nextStep,
    prevStep,
  } = useFunnel();
  const { trackStepComplete } = useFunnelTracking();

  // Set total steps on mount
  useState(() => {
    setTotalSteps(4);
  });

  const funnelConfig = config?.config || {};
  const headline = funnelConfig.headline || 'Get a Cash Offer in 24 Hours';
  const subheadline = funnelConfig.subheadline || 'No fees. No chains. Complete in 7 days.';
  const ctaText = funnelConfig.ctaText || 'Get My Free Cash Offer';

  const handlePropertyTypeSelect = (type: string) => {
    updateFormData({ propertyType: type });
    trackStepComplete(1, { propertyType: type });
    nextStep();
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
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
    const formElement = document.getElementById('funnel-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Step 1: Landing / Property Type Selection
  if (currentStep === 1) {
    return (
      <FunnelLayout showProgress showBackButton={false}>
        <FunnelHero
          headline={headline}
          subheadline={subheadline}
          ctaText={ctaText}
          ctaAction={scrollToForm}
          testimonial={{
            quote: "Sold in 5 days with no stress!",
            author: "Sarah T.",
            location: "Manchester",
            rating: 5,
          }}
        />

        {/* Property Type Selection */}
        <section id="funnel-form" className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-2">
                What type of property are you selling?
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Select your property type to get started
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {propertyTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePropertyTypeSelect(type.value)}
                      className={cn(
                        'p-6 rounded-xl border-2 text-center transition-all',
                        'hover:border-primary hover:bg-primary/5',
                        formData.propertyType === type.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-background'
                      )}
                    >
                      <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <span className="font-medium text-sm">{type.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <FunnelBenefits benefits={defaultSellerBenefits} variant="cards" columns={4} />
        <FunnelTestimonials testimonials={defaultTestimonials} variant="cards" />
        <FunnelCTA
          headline="Ready to Get Your Cash Offer?"
          subheadline="Join hundreds of satisfied sellers who've sold quickly with OffMrkt."
          ctaText="Start Now"
          ctaAction={scrollToForm}
          variant="gradient"
        />
      </FunnelLayout>
    );
  }

  // Step 2: Property Details
  if (currentStep === 2) {
    return (
      <FunnelLayout showProgress showBackButton>
        <div className="flex-1 flex items-center py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <FunnelSteps steps={steps} currentStep={currentStep} variant="compact" className="mb-8" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Tell us about your property</h2>
                  <p className="text-muted-foreground">
                    This helps us prepare an accurate offer
                  </p>
                </div>

                <form onSubmit={handleDetailsSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      placeholder="e.g., M1 4AH"
                      value={formData.postcode || ''}
                      onChange={(e) => updateFormData({ postcode: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select
                      value={formData.bedrooms || ''}
                      onValueChange={(value) => updateFormData({ bedrooms: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, '6+'].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Property Condition</Label>
                    <Select
                      value={formData.condition || ''}
                      onValueChange={(value) => updateFormData({ condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Move-in Ready</SelectItem>
                        <SelectItem value="good">Good Condition</SelectItem>
                        <SelectItem value="fair">Needs Some Work</SelectItem>
                        <SelectItem value="poor">Needs Major Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">When do you want to sell?</Label>
                    <Select
                      value={formData.timeline || ''}
                      onValueChange={(value) => updateFormData({ timeline: value })}
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
              <FunnelSteps steps={steps} currentStep={currentStep} variant="compact" className="mb-8" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Where should we send your offer?</h2>
                  <p className="text-muted-foreground">
                    We'll contact you within 24 hours with your cash offer
                  </p>
                </div>

                <FunnelLeadForm
                  submitLabel="Get My Cash Offer"
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

            <h1 className="text-3xl font-bold mb-4">Request Received!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              We've received your details and will call you within 24 hours with a cash offer for your property.
            </p>

            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-4">What happens next?</h3>
              <ol className="text-left space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>We'll review your property details</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>A property specialist will call you within 24 hours</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>You'll receive a no-obligation cash offer</span>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
              <Button onClick={() => navigate('/properties')}>
                Browse Our Properties
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </FunnelLayout>
  );
}
