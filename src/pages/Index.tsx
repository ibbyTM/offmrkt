import { useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { DualPathSection } from "@/components/landing/DualPathSection";
import { useAuth } from "@/contexts/AuthContext";

// Lazy-load below-the-fold sections
const BenefitsSection = lazy(() => import("@/components/landing/BenefitsSection").then(m => ({ default: m.BenefitsSection })));
const FeaturedPropertiesSection = lazy(() => import("@/components/landing/FeaturedPropertiesSection").then(m => ({ default: m.FeaturedPropertiesSection })));
const HowItWorksSection = lazy(() => import("@/components/landing/HowItWorksSection").then(m => ({ default: m.HowItWorksSection })));
const TestimonialsSection = lazy(() => import("@/components/landing/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const AftercareSection = lazy(() => import("@/components/landing/AftercareSection").then(m => ({ default: m.AftercareSection })));
const FAQSection = lazy(() => import("@/components/landing/FAQSection").then(m => ({ default: m.FAQSection })));
const ContactSection = lazy(() => import("@/components/landing/ContactSection").then(m => ({ default: m.ContactSection })));
const FloatingLeadCapture = lazy(() => import("@/components/landing/FloatingLeadCapture").then(m => ({ default: m.FloatingLeadCapture })));

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/properties");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <Layout>
      <HeroSection />
      <DualPathSection />
      <Suspense fallback={null}>
        <BenefitsSection />
        <FeaturedPropertiesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <AftercareSection />
        <FAQSection />
        <ContactSection />
        <FloatingLeadCapture />
      </Suspense>
    </Layout>
  );
};

export default Index;
