import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { PartnerLogos } from "@/components/landing/PartnerLogos";
import { TrustSection } from "@/components/landing/TrustSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FeaturedPropertiesSection } from "@/components/landing/FeaturedPropertiesSection";
import { WhyChooseUsSection } from "@/components/landing/WhyChooseUsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { AftercareSection } from "@/components/landing/AftercareSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { FloatingLeadCapture } from "@/components/landing/FloatingLeadCapture";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users to properties
  useEffect(() => {
    if (!loading && user) {
      navigate("/properties");
    }
  }, [user, loading, navigate]);

  // Show loading animation while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative flex items-center justify-center w-40 h-40"
        >
          {/* Pulsing glow ring */}
          <motion.div
            className="absolute w-24 h-24 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Second glow ring with offset timing */}
          <motion.div
            className="absolute w-20 h-20 rounded-full bg-primary/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Orbiting dots */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary"
              style={{
                left: "50%",
                top: "50%",
                marginLeft: "-4px",
                marginTop: "-4px",
              }}
              animate={{
                x: [
                  Math.cos((i * Math.PI * 2) / 6) * 60,
                  Math.cos((i * Math.PI * 2) / 6 + Math.PI * 2) * 60,
                ],
                y: [
                  Math.sin((i * Math.PI * 2) / 6) * 60,
                  Math.sin((i * Math.PI * 2) / 6 + Math.PI * 2) * 60,
                ],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.15,
              }}
            />
          ))}

          {/* Floating accent dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`float-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + i * 25}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))}
          
          {/* House icon with breathing animation */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Home className="h-16 w-16 text-primary" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
        
        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-muted-foreground text-sm tracking-wide"
        >
          Loading...
        </motion.p>
      </div>
    );
  }

  // Show landing page for non-logged-in users
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
      <AftercareSection />
      <FAQSection />
      <ContactSection />
      <FloatingLeadCapture />
    </Layout>
  );
};

export default Index;
