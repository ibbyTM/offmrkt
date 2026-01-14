import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { PartnerLogos } from "@/components/landing/PartnerLogos";
import { TrustSection } from "@/components/landing/TrustSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FeaturedPropertiesSection } from "@/components/landing/FeaturedPropertiesSection";
import { WhyChooseUsSection } from "@/components/landing/WhyChooseUsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ContactSection } from "@/components/landing/ContactSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PartnerLogos />
      <TrustSection />
      <BenefitsSection />
      <FeaturedPropertiesSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
    </Layout>
  );
};

export default Index;
