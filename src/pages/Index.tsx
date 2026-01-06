import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CTASection } from "@/components/landing/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <TrustSection />
      <DashboardPreview />
      <BenefitsSection />
      <HowItWorksSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
