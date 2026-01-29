import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowUp, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "information-collected", title: "2. Information We Collect" },
  { id: "how-we-use", title: "3. How We Use Your Information" },
  { id: "legal-basis", title: "4. Legal Basis for Processing" },
  { id: "sharing", title: "5. Sharing Your Information" },
  { id: "data-retention", title: "6. Data Retention" },
  { id: "your-rights", title: "7. Your Rights" },
  { id: "cookies", title: "8. Cookies" },
  { id: "changes", title: "9. Changes to This Policy" },
  { id: "contact", title: "10. Contact Us" },
];

export default function Privacy() {
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
                Privacy Policy
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
                <section id="introduction" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
                  <p className="text-muted-foreground">
                    Welcome to Off The Markets ("we", "our", or "us"). We are committed to protecting your personal data 
                    and respecting your privacy. This Privacy Policy explains how we collect, use, and safeguard 
                    your information when you visit our website and use our property investment platform.
                  </p>
                  <p className="text-muted-foreground">
                    We are a UK-based company and comply with the UK General Data Protection Regulation (UK GDPR) 
                    and the Data Protection Act 2018. This policy applies to all personal data we process about 
                    you when you interact with our platform, whether as a property investor, seller, or general 
                    visitor.
                  </p>
                </section>

                <section id="information-collected" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">2.1 Information You Provide</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Account Information:</strong> Full name, email address, phone number when you register</li>
                    <li><strong>Investor Profile:</strong> Investment experience, budget range, preferred locations, property strategies, funding sources</li>
                    <li><strong>Property Submissions:</strong> Property details, addresses, photos, contact information for sellers</li>
                    <li><strong>Communications:</strong> Messages sent through our contact forms or email correspondence</li>
                    <li><strong>Service Preferences:</strong> Your preferences for mortgage brokers, solicitors, or property management services</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mt-6">2.2 Information Collected Automatically</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                    <li><strong>Usage Data:</strong> Pages visited, properties viewed, time spent on site, click patterns</li>
                    <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                    <li><strong>Cookies:</strong> See our <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link> for details</li>
                  </ul>
                </section>

                <section id="how-we-use" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground">We use your personal data for the following purposes:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Platform Services:</strong> Matching you with suitable investment properties based on your criteria</li>
                    <li><strong>Account Management:</strong> Creating and maintaining your investor account</li>
                    <li><strong>Property Reservations:</strong> Processing property reservations and coordinating viewings</li>
                    <li><strong>Partner Referrals:</strong> Connecting you with trusted mortgage brokers, solicitors, and other service providers (only with your consent)</li>
                    <li><strong>Communication:</strong> Sending property alerts, updates, and responding to enquiries</li>
                    <li><strong>Marketing:</strong> Sending newsletters and promotional content (only with your explicit consent)</li>
                    <li><strong>Platform Improvement:</strong> Analysing usage patterns to enhance our services</li>
                    <li><strong>Legal Compliance:</strong> Meeting our regulatory and legal obligations</li>
                  </ul>
                </section>

                <section id="legal-basis" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">4. Legal Basis for Processing</h2>
                  <p className="text-muted-foreground">Under UK GDPR, we process your data based on:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Contract:</strong> Processing necessary to provide our platform services you've requested</li>
                    <li><strong>Consent:</strong> Where you've given explicit permission (e.g., marketing communications, partner referrals)</li>
                    <li><strong>Legitimate Interest:</strong> For platform security, fraud prevention, and service improvements</li>
                    <li><strong>Legal Obligation:</strong> Where processing is required by law (e.g., anti-money laundering checks)</li>
                  </ul>
                </section>

                <section id="sharing" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">5. Sharing Your Information</h2>
                  <p className="text-muted-foreground">We may share your personal data with:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Property Sellers:</strong> When you express interest in a property or make a reservation</li>
                    <li><strong>Service Partners:</strong> Mortgage brokers, solicitors, and property management companies (only with your explicit consent)</li>
                    <li><strong>Service Providers:</strong> Trusted third parties who help us operate our platform (hosting, email services)</li>
                    <li><strong>Legal Authorities:</strong> When required by law or to protect our legal rights</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    We never sell your personal data to third parties for marketing purposes.
                  </p>
                </section>

                <section id="data-retention" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">6. Data Retention</h2>
                  <p className="text-muted-foreground">We retain your personal data for:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Active Accounts:</strong> As long as your account remains active</li>
                    <li><strong>Inactive Accounts:</strong> Up to 3 years after last activity, then anonymised or deleted</li>
                    <li><strong>Transaction Records:</strong> 7 years for legal and tax compliance</li>
                    <li><strong>Marketing Preferences:</strong> Until you withdraw consent</li>
                  </ul>
                </section>

                <section id="your-rights" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">7. Your Rights</h2>
                  <p className="text-muted-foreground">Under UK GDPR, you have the right to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                    <li><strong>Rectification:</strong> Correct any inaccurate or incomplete data</li>
                    <li><strong>Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
                    <li><strong>Restrict Processing:</strong> Limit how we use your data in certain circumstances</li>
                    <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
                    <li><strong>Object:</strong> Object to processing based on legitimate interests or for direct marketing</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    To exercise any of these rights, please contact us using the details in section 10. 
                    We will respond to your request within one month.
                  </p>
                </section>

                <section id="cookies" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">8. Cookies</h2>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to enhance your experience on our platform. 
                    For detailed information about the cookies we use and how to manage your preferences, 
                    please see our <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
                  </p>
                </section>

                <section id="changes" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">9. Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. We will notify you of any significant 
                    changes by posting the new policy on this page and updating the "Last updated" date. 
                    We encourage you to review this policy periodically.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">10. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy or wish to exercise your rights, 
                    please contact us:
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="h-5 w-5 text-primary" />
                      <a href="mailto:privacy@off-the-markets.co.uk" className="hover:text-primary">
                        privacy@off-the-markets.co.uk
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Off The Markets Ltd, London, United Kingdom</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4">
                    You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) 
                    if you believe we have not handled your personal data properly. Visit{" "}
                    <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      ico.org.uk
                    </a>{" "}
                    for more information.
                  </p>
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
