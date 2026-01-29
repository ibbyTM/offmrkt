import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowUp, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "platform-description", title: "2. Platform Description" },
  { id: "eligibility", title: "3. User Eligibility" },
  { id: "registration", title: "4. Account Registration" },
  { id: "investor-verification", title: "5. Investor Verification" },
  { id: "property-listings", title: "6. Property Listings" },
  { id: "reservations", title: "7. Reservations & Purchases" },
  { id: "fees", title: "8. Fees & Payments" },
  { id: "user-conduct", title: "9. User Conduct" },
  { id: "intellectual-property", title: "10. Intellectual Property" },
  { id: "disclaimers", title: "11. Disclaimers" },
  { id: "liability", title: "12. Limitation of Liability" },
  { id: "disputes", title: "13. Dispute Resolution" },
  { id: "governing-law", title: "14. Governing Law" },
  { id: "contact", title: "15. Contact Us" },
];

export default function Terms() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Terms of Service
              </h1>
              <p className="text-muted-foreground text-lg">
                Last updated: January 2025
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Table of Contents - Sidebar */}
              <aside className="hidden md:block">
                <div className="sticky top-24">
                  <h3 className="font-semibold text-foreground mb-4">Contents</h3>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="md:col-span-3 prose prose-neutral dark:prose-invert max-w-none">
                <section id="acceptance" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing or using the Off The Markets platform ("Platform"), you agree to be bound by these 
                    Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Platform.
                  </p>
                  <p className="text-muted-foreground">
                    These Terms constitute a legally binding agreement between you and Off The Markets Ltd ("we", "our", "us"). 
                    We reserve the right to modify these Terms at any time. Your continued use of the Platform 
                    after any changes constitutes acceptance of the new Terms.
                  </p>
                </section>

                <section id="platform-description" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">2. Platform Description</h2>
                  <p className="text-muted-foreground">
                    Off The Markets is an off-market property investment platform that connects serious property investors
                    with exclusive below-market-value investment opportunities across the UK. Our services include:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Access to curated off-market property deals</li>
                    <li>Property analysis tools and investment metrics</li>
                    <li>Investor verification and matching services</li>
                    <li>Property reservation facilitation</li>
                    <li>Referrals to trusted service partners (mortgage brokers, solicitors, etc.)</li>
                    <li>Property seller submission services</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    We act as an intermediary platform and do not directly sell, purchase, or own properties listed 
                    on the Platform unless expressly stated.
                  </p>
                </section>

                <section id="eligibility" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">3. User Eligibility</h2>
                  <p className="text-muted-foreground">To use our Platform, you must:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Be at least 18 years of age</li>
                    <li>Have the legal capacity to enter into binding contracts</li>
                    <li>Not be prohibited from using our services under applicable law</li>
                    <li>Provide accurate and complete registration information</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    For access to full property details and investment opportunities, you must complete our 
                    investor verification process.
                  </p>
                </section>

                <section id="registration" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">4. Account Registration</h2>
                  <p className="text-muted-foreground">When creating an account, you agree to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and update your information to keep it accurate</li>
                    <li>Keep your login credentials secure and confidential</li>
                    <li>Notify us immediately of any unauthorised access to your account</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    We reserve the right to suspend or terminate accounts that provide false information or 
                    violate these Terms.
                  </p>
                </section>

                <section id="investor-verification" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">5. Investor Verification</h2>
                  <p className="text-muted-foreground">
                    To access exclusive property deals, investors must complete our verification questionnaire. 
                    This process helps us:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Understand your investment criteria and budget</li>
                    <li>Match you with suitable properties</li>
                    <li>Ensure deals are presented to serious, qualified investors</li>
                    <li>Provide a better experience for property sellers</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Verification does not guarantee access to all properties. We reserve the right to approve 
                    or reject investor applications at our discretion.
                  </p>
                </section>

                <section id="property-listings" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">6. Property Listings</h2>
                  <p className="text-muted-foreground">
                    While we strive for accuracy, we do not guarantee that property listings are complete, 
                    accurate, or up-to-date. Users should:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Conduct their own due diligence before making investment decisions</li>
                    <li>Verify all property details, financial projections, and legal matters independently</li>
                    <li>Seek professional advice (legal, financial, surveyor) before purchasing</li>
                    <li>Understand that investment returns are not guaranteed</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Property listings may be withdrawn at any time without notice. Availability is not guaranteed 
                    until a formal agreement is signed.
                  </p>
                </section>

                <section id="reservations" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">7. Reservations & Purchases</h2>
                  <p className="text-muted-foreground">
                    When you reserve a property through our Platform:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>A reservation fee may be required to secure the property</li>
                    <li>Reservation fees are subject to our refund policy</li>
                    <li>Reservations are subject to seller acceptance and legal completion</li>
                    <li>We facilitate introductions but are not party to the purchase contract</li>
                    <li>All purchases are subject to separate legal agreements between buyer and seller</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    We strongly recommend engaging a solicitor before entering into any property transaction.
                  </p>
                </section>

                <section id="fees" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">8. Fees & Payments</h2>
                  <p className="text-muted-foreground">
                    Our fee structure includes:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Platform Access:</strong> Currently free for registered investors</li>
                    <li><strong>Reservation Fees:</strong> May apply to secure specific properties</li>
                    <li><strong>Success Fees:</strong> May apply upon successful property purchase</li>
                    <li><strong>Partner Referral:</strong> We may receive referral fees from partner services</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    All fees will be clearly disclosed before you are required to pay. We reserve the right 
                    to modify our fee structure with reasonable notice.
                  </p>
                </section>

                <section id="user-conduct" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">9. User Conduct</h2>
                  <p className="text-muted-foreground">You agree not to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Provide false or misleading information</li>
                    <li>Use the Platform for any unlawful purpose</li>
                    <li>Attempt to circumvent our verification process</li>
                    <li>Share property information with non-verified users</li>
                    <li>Interfere with the Platform's security or functionality</li>
                    <li>Harvest or collect user data without consent</li>
                    <li>Engage in any form of harassment or abusive behaviour</li>
                    <li>Use automated systems to access the Platform without permission</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Violation of these rules may result in immediate account suspension or termination.
                  </p>
                </section>

                <section id="intellectual-property" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">10. Intellectual Property</h2>
                  <p className="text-muted-foreground">
                    All content on the Platform, including but not limited to text, graphics, logos, images, 
                    software, and data compilations, is the property of Off The Markets or its content suppliers and 
                    is protected by intellectual property laws.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    You may not reproduce, distribute, modify, or create derivative works from any Platform 
                    content without our express written permission.
                  </p>
                </section>

                <section id="disclaimers" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">11. Disclaimers</h2>
                  <p className="text-muted-foreground">
                    THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
                    EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    We do not provide financial, legal, or investment advice. All investment decisions are 
                    made at your own risk. Property values can go down as well as up, and rental income is 
                    not guaranteed.
                  </p>
                </section>

                <section id="liability" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">12. Limitation of Liability</h2>
                  <p className="text-muted-foreground">
                    To the maximum extent permitted by law, Off The Markets shall not be liable for any indirect, 
                    incidental, special, consequential, or punitive damages arising from your use of the Platform.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    Our total liability for any claims arising from these Terms or your use of the Platform 
                    shall not exceed the fees you have paid to us in the twelve months preceding the claim.
                  </p>
                </section>

                <section id="disputes" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">13. Dispute Resolution</h2>
                  <p className="text-muted-foreground">
                    Any disputes arising from these Terms shall first be attempted to be resolved through 
                    good faith negotiation. If negotiation fails, disputes may be referred to mediation 
                    before proceeding to legal action.
                  </p>
                </section>

                <section id="governing-law" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">14. Governing Law</h2>
                  <p className="text-muted-foreground">
                    These Terms shall be governed by and construed in accordance with the laws of England 
                    and Wales. Any legal proceedings shall be brought exclusively in the courts of England 
                    and Wales.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">15. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms, please contact us:
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="h-5 w-5 text-primary" />
                      <a href="mailto:legal@off-the-markets.co.uk" className="hover:text-primary">
                        legal@off-the-markets.co.uk
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Off The Markets Ltd, London, United Kingdom</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 rounded-full h-12 w-12 p-0 shadow-lg"
            size="icon"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </div>
    </Layout>
  );
}
