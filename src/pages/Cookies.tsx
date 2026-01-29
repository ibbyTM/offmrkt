import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowUp, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const sections = [
  { id: "what-are-cookies", title: "1. What Are Cookies?" },
  { id: "how-we-use", title: "2. How We Use Cookies" },
  { id: "types-of-cookies", title: "3. Types of Cookies" },
  { id: "cookie-table", title: "4. Cookies We Use" },
  { id: "third-party", title: "5. Third-Party Cookies" },
  { id: "managing-cookies", title: "6. Managing Cookies" },
  { id: "changes", title: "7. Changes to This Policy" },
  { id: "contact", title: "8. Contact Us" },
];

const cookieData = [
  {
    name: "cookie_consent",
    purpose: "Stores your cookie consent preferences",
    type: "Essential",
    duration: "1 year",
  },
  {
    name: "sb-*-auth-token",
    purpose: "Maintains your authenticated session",
    type: "Essential",
    duration: "Session",
  },
  {
    name: "theme",
    purpose: "Remembers your dark/light mode preference",
    type: "Preferences",
    duration: "1 year",
  },
  {
    name: "comparison_properties",
    purpose: "Stores properties you've added to compare",
    type: "Preferences",
    duration: "Session",
  },
];

export default function Cookies() {
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
                Cookie Policy
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
                <section id="what-are-cookies" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">1. What Are Cookies?</h2>
                  <p className="text-muted-foreground">
                    Cookies are small text files that are placed on your device when you visit a website. 
                    They are widely used to make websites work more efficiently and provide useful information 
                    to website owners.
                  </p>
                  <p className="text-muted-foreground">
                    Cookies can be "persistent" (remaining on your device for a set period or until you 
                    delete them) or "session" cookies (deleted when you close your browser).
                  </p>
                </section>

                <section id="how-we-use" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">2. How We Use Cookies</h2>
                  <p className="text-muted-foreground">We use cookies to:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Keep you signed in to your account</li>
                    <li>Remember your preferences (such as dark/light mode)</li>
                    <li>Understand how you use our Platform to improve our services</li>
                    <li>Store properties you're comparing temporarily</li>
                    <li>Remember your cookie consent preferences</li>
                  </ul>
                </section>

                <section id="types-of-cookies" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">3. Types of Cookies</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">3.1 Essential Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies are necessary for the Platform to function properly. They enable core 
                    functionality such as security, authentication, and session management. You cannot 
                    opt out of these cookies as the Platform would not work without them.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6">3.2 Preference Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies allow us to remember choices you make (such as your theme preference) 
                    and provide enhanced, more personalised features.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6">3.3 Analytics Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies help us understand how visitors interact with our Platform by collecting 
                    and reporting information anonymously. This helps us improve our services.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6">3.4 Marketing Cookies</h3>
                  <p className="text-muted-foreground">
                    We currently do not use marketing cookies. If this changes in the future, we will 
                    update this policy and seek your consent before using them.
                  </p>
                </section>

                <section id="cookie-table" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">4. Cookies We Use</h2>
                  <p className="text-muted-foreground mb-4">
                    Here is a list of the main cookies used on our Platform:
                  </p>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cookie Name</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cookieData.map((cookie) => (
                          <TableRow key={cookie.name}>
                            <TableCell className="font-mono text-sm">{cookie.name}</TableCell>
                            <TableCell>{cookie.purpose}</TableCell>
                            <TableCell>{cookie.type}</TableCell>
                            <TableCell>{cookie.duration}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>

                <section id="third-party" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">5. Third-Party Cookies</h2>
                  <p className="text-muted-foreground">
                    Some cookies on our Platform are placed by third-party services. These may include:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li><strong>Authentication Services:</strong> For secure login functionality</li>
                    <li><strong>Analytics Providers:</strong> If enabled, to help us understand usage patterns</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    We do not control these third-party cookies. Please refer to the relevant third party's 
                    privacy policy for more information.
                  </p>
                </section>

                <section id="managing-cookies" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">6. Managing Cookies</h2>
                  <p className="text-muted-foreground">
                    You can manage your cookie preferences through our cookie consent banner when you first 
                    visit our Platform, or by adjusting your browser settings.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">Browser Settings</h3>
                  <p className="text-muted-foreground">
                    Most browsers allow you to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>View what cookies are stored and delete them individually</li>
                    <li>Block third-party cookies</li>
                    <li>Block cookies from specific sites</li>
                    <li>Block all cookies</li>
                    <li>Delete all cookies when you close your browser</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Please note that blocking all cookies may affect the functionality of our Platform 
                    and other websites you visit.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6">Browser-Specific Instructions</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>
                      <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Google Chrome
                      </a>
                    </li>
                    <li>
                      <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Mozilla Firefox
                      </a>
                    </li>
                    <li>
                      <a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Safari
                      </a>
                    </li>
                    <li>
                      <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Microsoft Edge
                      </a>
                    </li>
                  </ul>
                </section>

                <section id="changes" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">7. Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this Cookie Policy from time to time. Any changes will be posted on this 
                    page with an updated revision date. We encourage you to review this policy periodically.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl font-bold text-foreground">8. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about our use of cookies, please see our{" "}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{" "}
                    or contact us:
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href="mailto:privacy@offthemarkets.co.uk" className="hover:text-primary">
                      privacy@offthemarkets.co.uk
                    </a>
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
