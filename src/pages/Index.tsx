import { useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { DualPathSection } from "@/components/landing/DualPathSection";
import { useAuth } from "@/contexts/AuthContext";

// Lazy-load below-the-fold sections
const PartnerLogos = lazy(() => import("@/components/landing/PartnerLogos").then(m => ({ default: m.PartnerLogos })));
const TrustSection = lazy(() => import("@/components/landing/TrustSection").then(m => ({ default: m.TrustSection })));
const BenefitsSection = lazy(() => import("@/components/landing/BenefitsSection").then(m => ({ default: m.BenefitsSection })));
const FeaturedPropertiesSection = lazy(() => import("@/components/landing/FeaturedPropertiesSection").then(m => ({ default: m.FeaturedPropertiesSection })));
const WhyChooseUsSection = lazy(() => import("@/components/landing/WhyChooseUsSection").then(m => ({ default: m.WhyChooseUsSection })));
const HowItWorksSection = lazy(() => import("@/components/landing/HowItWorksSection").then(m => ({ default: m.HowItWorksSection })));
const TestimonialsSection = lazy(() => import("@/components/landing/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const AftercareSection = lazy(() => import("@/components/landing/AftercareSection").then(m => ({ default: m.AftercareSection })));
const FAQSection = lazy(() => import("@/components/landing/FAQSection").then(m => ({ default: m.FAQSection })));
const ContactSection = lazy(() => import("@/components/landing/ContactSection").then(m => ({ default: m.ContactSection })));
const FloatingLeadCapture = lazy(() => import("@/components/landing/FloatingLeadCapture").then(m => ({ default: m.FloatingLeadCapture })));

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users to properties
  useEffect(() => {
    if (!loading && user) {
      navigate("/properties");
    }
  }, [user, loading, navigate]);

  // Show simple loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  // Show landing page for non-logged-in users
  return (
    <Layout>
      <HeroSection />
      <DualPathSection />
      <PartnerLogos />
      <TrustSection />
      <BenefitsSection />
      <FeaturedPropertiesSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <AftercareSection />
      <FAQSection />
      <ContactSection />
      <FloatingLeadCapture />
    </Layout>
  );
};

export default Index;
