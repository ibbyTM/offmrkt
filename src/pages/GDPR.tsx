import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "data-controller", title: "Data Controller" },
  { id: "data-protection-officer", title: "Data Protection Officer" },
  { id: "lawful-basis", title: "Lawful Basis for Processing" },
  { id: "processing-activities", title: "Data Processing Activities" },
  { id: "your-rights", title: "Your Rights Under GDPR" },
  { id: "dsar", title: "Data Subject Access Requests" },
  { id: "international-transfers", title: "International Data Transfers" },
  { id: "security-measures", title: "Data Security Measures" },
  { id: "data-breaches", title: "Data Breach Procedures" },
  { id: "childrens-data", title: "Children's Data" },
  { id: "automated-decisions", title: "Automated Decision Making" },
  { id: "complaints", title: "Complaints" },
  { id: "contact", title: "Contact & Requests" },
];

const GDPR = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">GDPR Policy</h1>
          <p className="text-lg opacity-90">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Sticky Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-foreground">Contents</h3>
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
            <div className="lg:col-span-3 prose prose-slate dark:prose-invert max-w-none">
              <section id="introduction" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p>
                  This GDPR Policy explains how Off The Markets ("we", "us", or "our") complies with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. This policy supplements our Privacy Policy and provides detailed information about your rights and our obligations under data protection law.
                </p>
                <p>
                  We are committed to protecting your personal data and being transparent about how we collect, use, and safeguard your information. This policy applies to all personal data we process, whether you are a property investor, property seller, or website visitor.
                </p>
                <p>
                  For general information about how we handle your data, please also read our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              </section>

              <section id="data-controller" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">2. Data Controller</h2>
                <p>
                  Off The Markets is the data controller responsible for your personal data. This means we determine the purposes and means of processing your personal data.
                </p>
                <div className="bg-muted/50 p-6 rounded-lg my-6">
                  <h4 className="font-semibold mb-3">Data Controller Details</h4>
                  <ul className="list-none space-y-2 pl-0">
                    <li><strong>Company Name:</strong> Off The Markets Ltd</li>
                    <li><strong>Registered Address:</strong> [Company Address]</li>
                    <li><strong>Company Registration Number:</strong> [Registration Number]</li>
                    <li><strong>ICO Registration Number:</strong> [ICO Number]</li>
                    <li><strong>Email:</strong> privacy@off-the-markets.co.uk</li>
                  </ul>
                </div>
              </section>

              <section id="data-protection-officer" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">3. Data Protection Officer</h2>
                <p>
                  We have appointed a Data Protection Lead to oversee compliance with this policy and data protection legislation. If you have any questions about this policy or our data practices, please contact our Data Protection Lead:
                </p>
                <div className="bg-muted/50 p-6 rounded-lg my-6">
                  <ul className="list-none space-y-2 pl-0">
                    <li><strong>Email:</strong> dpo@off-the-markets.co.uk</li>
                    <li><strong>Post:</strong> Data Protection Lead, Off The Markets Ltd, [Company Address]</li>
                  </ul>
                </div>
                <p>
                  You have the right to make a complaint at any time to the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues.
                </p>
              </section>

              <section id="lawful-basis" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">4. Lawful Basis for Processing</h2>
                <p>
                  Under UK GDPR, we must have a valid legal basis to process your personal data. We rely on the following lawful bases:
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Contract Performance (Article 6(1)(b))</h3>
                <p>We process data necessary to:</p>
                <ul>
                  <li>Provide access to our property investment platform</li>
                  <li>Process property submissions from sellers</li>
                  <li>Manage investor applications and approvals</li>
                  <li>Facilitate property transactions and reservations</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Legitimate Interests (Article 6(1)(f))</h3>
                <p>We may process data based on our legitimate business interests, including:</p>
                <ul>
                  <li>Improving our services and user experience</li>
                  <li>Fraud prevention and platform security</li>
                  <li>Internal analytics and business development</li>
                  <li>Responding to enquiries and providing customer support</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Consent (Article 6(1)(a))</h3>
                <p>Where we rely on consent, this includes:</p>
                <ul>
                  <li>Marketing communications and newsletters</li>
                  <li>Non-essential cookies and tracking technologies</li>
                  <li>Sharing data with third-party partners for promotional purposes</li>
                </ul>
                <p>You can withdraw consent at any time by contacting us or using the unsubscribe options provided.</p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Legal Obligation (Article 6(1)(c))</h3>
                <p>We process certain data to comply with legal requirements, such as:</p>
                <ul>
                  <li>Anti-money laundering (AML) checks</li>
                  <li>Tax reporting obligations</li>
                  <li>Regulatory requirements for property transactions</li>
                </ul>
              </section>

              <section id="processing-activities" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">5. Data Processing Activities</h2>
                <p>
                  Below is a summary of our main data processing activities as required under Article 30 of UK GDPR:
                </p>
                
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full border border-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-b">Processing Activity</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-b">Data Categories</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-b">Lawful Basis</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-b">Retention Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-3 text-sm border-b">Account Registration</td>
                        <td className="px-4 py-3 text-sm border-b">Name, email, phone</td>
                        <td className="px-4 py-3 text-sm border-b">Contract</td>
                        <td className="px-4 py-3 text-sm border-b">Duration of account + 6 years</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm border-b">Investor Applications</td>
                        <td className="px-4 py-3 text-sm border-b">Financial info, investment preferences</td>
                        <td className="px-4 py-3 text-sm border-b">Contract / Legal obligation</td>
                        <td className="px-4 py-3 text-sm border-b">6 years from last activity</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm border-b">Property Submissions</td>
                        <td className="px-4 py-3 text-sm border-b">Contact details, property info</td>
                        <td className="px-4 py-3 text-sm border-b">Contract</td>
                        <td className="px-4 py-3 text-sm border-b">6 years from submission</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm border-b">Marketing Communications</td>
                        <td className="px-4 py-3 text-sm border-b">Email, preferences</td>
                        <td className="px-4 py-3 text-sm border-b">Consent</td>
                        <td className="px-4 py-3 text-sm border-b">Until consent withdrawn</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm border-b">Analytics</td>
                        <td className="px-4 py-3 text-sm border-b">Usage data, device info</td>
                        <td className="px-4 py-3 text-sm border-b">Consent / Legitimate interest</td>
                        <td className="px-4 py-3 text-sm border-b">26 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="your-rights" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">6. Your Rights Under GDPR</h2>
                <p>
                  Under UK GDPR, you have the following rights regarding your personal data:
                </p>

                <div className="space-y-6 mt-6">
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">Right of Access (Article 15)</h4>
                    <p className="text-sm mb-0">You have the right to request a copy of the personal data we hold about you, along with supplementary information about how we process it.</p>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">Right to Rectification (Article 16)</h4>
                    <p className="text-sm mb-0">You can request that we correct any inaccurate personal data or complete any incomplete data we hold about you.</p>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">Right to Erasure (Article 17)</h4>
                    <p className="text-sm mb-0">Also known as the "right to be forgotten", you can request deletion of your personal data in certain circumstances, such as when the data is no longer necessary for the purpose it was collected.</p>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">Right to Restrict Processing (Article 18)</h4>
                    <p className="text-sm mb-0">You can request that we limit how we use your data while complaints are being investigated or if processing is unlawful.</p>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">Right to Data Portability (Article 20)</h4>
                    <p className="text-sm mb-0">You can request your data in a structured, commonly used, machine-readable format to transfer to another service provider.</p>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">Right to Object (Article 21)</h4>
                    <p className="text-sm mb-0">You can object to processing based on legitimate interests or for direct marketing purposes at any time.</p>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2">Rights Related to Automated Decision Making (Article 22)</h4>
                    <p className="text-sm mb-0">You have rights regarding decisions made solely by automated means that significantly affect you.</p>
                  </div>
                </div>

                <p className="mt-6">
                  To exercise any of these rights, please submit a request using the methods described in the "Data Subject Access Requests" section below.
                </p>
              </section>

              <section id="dsar" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">7. Data Subject Access Requests</h2>
                <p>
                  You can submit a Data Subject Access Request (DSAR) to exercise your rights under GDPR. Here's how the process works:
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">How to Submit a Request</h3>
                <ol>
                  <li><strong>Email:</strong> Send your request to dpo@off-the-markets.co.uk with "DSAR Request" in the subject line</li>
                  <li><strong>Post:</strong> Write to Data Protection Lead, Off The Markets Ltd, [Company Address]</li>
                  <li><strong>Account:</strong> For basic access, you can view and download your data through your account settings</li>
                </ol>

                <h3 className="text-xl font-semibold mt-6 mb-3">What to Include</h3>
                <ul>
                  <li>Your full name and the email address associated with your account</li>
                  <li>Which right(s) you wish to exercise</li>
                  <li>Any specific information that will help us locate your data</li>
                  <li>Proof of identity (we may request this to verify your identity)</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Response Timeframes</h3>
                <div className="bg-muted/50 p-6 rounded-lg my-4">
                  <ul className="list-none space-y-2 pl-0 mb-0">
                    <li><strong>Standard response:</strong> Within 1 month of receiving your request</li>
                    <li><strong>Complex requests:</strong> May be extended by up to 2 additional months (we will notify you)</li>
                    <li><strong>Acknowledgement:</strong> Within 5 working days of receipt</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold mt-6 mb-3">Fees</h3>
                <p>
                  We do not charge a fee for most requests. However, we may charge a reasonable fee for manifestly unfounded, excessive, or repetitive requests, or refuse to act on such requests.
                </p>
              </section>

              <section id="international-transfers" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">8. International Data Transfers</h2>
                <p>
                  We primarily store and process your data within the United Kingdom and European Economic Area (EEA). However, some of our service providers may transfer data internationally.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Safeguards for International Transfers</h3>
                <p>Where we transfer personal data outside the UK/EEA, we ensure appropriate safeguards are in place:</p>
                <ul>
                  <li><strong>Adequacy decisions:</strong> Transfers to countries deemed adequate by the UK government</li>
                  <li><strong>Standard Contractual Clauses (SCCs):</strong> EU/UK approved contractual terms with data recipients</li>
                  <li><strong>UK IDTA:</strong> The UK International Data Transfer Agreement where applicable</li>
                  <li><strong>Binding Corporate Rules:</strong> For transfers within multinational organisations</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Third-Party Processors</h3>
                <p>
                  Our main service providers that may involve international transfers include cloud hosting services, email delivery platforms, and analytics providers. We ensure all such providers have appropriate data protection agreements in place.
                </p>
                <p>
                  You can request more details about international transfers and the safeguards in place by contacting our Data Protection Lead.
                </p>
              </section>

              <section id="security-measures" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">9. Data Security Measures</h2>
                <p>
                  We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Technical Measures</h3>
                <ul>
                  <li><strong>Encryption:</strong> Data encrypted in transit (TLS/SSL) and at rest (AES-256)</li>
                  <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
                  <li><strong>Network Security:</strong> Firewalls, intrusion detection, and regular security scanning</li>
                  <li><strong>Secure Development:</strong> Security-focused code reviews and testing</li>
                  <li><strong>Backup:</strong> Regular encrypted backups with tested recovery procedures</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Organisational Measures</h3>
                <ul>
                  <li><strong>Staff Training:</strong> Regular data protection and security awareness training</li>
                  <li><strong>Access Policies:</strong> Least privilege access principles</li>
                  <li><strong>Vendor Management:</strong> Due diligence and contractual requirements for processors</li>
                  <li><strong>Incident Response:</strong> Documented procedures for security incidents</li>
                  <li><strong>Regular Audits:</strong> Periodic security assessments and reviews</li>
                </ul>
              </section>

              <section id="data-breaches" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">10. Data Breach Procedures</h2>
                <p>
                  In the event of a personal data breach, we have procedures in place to detect, report, and investigate breaches in accordance with Article 33 and 34 of UK GDPR.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Our Breach Response Process</h3>
                <ol>
                  <li><strong>Detection & Containment:</strong> Identify and contain the breach immediately</li>
                  <li><strong>Assessment:</strong> Evaluate the risk to individuals' rights and freedoms</li>
                  <li><strong>ICO Notification:</strong> Report to the ICO within 72 hours if required</li>
                  <li><strong>Individual Notification:</strong> Inform affected individuals if there is high risk</li>
                  <li><strong>Documentation:</strong> Record all breaches regardless of severity</li>
                  <li><strong>Review:</strong> Implement measures to prevent recurrence</li>
                </ol>

                <h3 className="text-xl font-semibold mt-6 mb-3">What We Will Tell You</h3>
                <p>If a breach is likely to result in a high risk to your rights, we will notify you without undue delay and provide:</p>
                <ul>
                  <li>A description of the nature of the breach</li>
                  <li>The likely consequences of the breach</li>
                  <li>Measures we have taken or propose to take</li>
                  <li>Recommendations for how you can protect yourself</li>
                  <li>Contact details for our Data Protection Lead</li>
                </ul>
              </section>

              <section id="childrens-data" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">11. Children's Data</h2>
                <p>
                  Our services are designed for adults and are not intended for children under 18 years of age. We do not knowingly collect personal data from children.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with personal data, please contact our Data Protection Lead. We will take steps to remove such information from our systems.
                </p>
                <p>
                  Property investment activities inherently require participants to be of legal age to enter into contracts, which in the UK is 18 years or older.
                </p>
              </section>

              <section id="automated-decisions" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">12. Automated Decision Making</h2>
                <p>
                  Under Article 22 of UK GDPR, you have rights regarding automated decision-making and profiling that produces legal or similarly significant effects.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Our Use of Automated Processing</h3>
                <p>We may use automated processing in the following areas:</p>
                <ul>
                  <li><strong>Investor Matching:</strong> Algorithmic matching of investment preferences with available properties (not solely automated - human review involved)</li>
                  <li><strong>Fraud Detection:</strong> Automated monitoring for suspicious activity patterns</li>
                  <li><strong>Risk Assessment:</strong> Initial screening of investor applications (human decision-making follows)</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Your Rights</h3>
                <p>Where automated decisions significantly affect you, you have the right to:</p>
                <ul>
                  <li>Request human intervention in the decision</li>
                  <li>Express your point of view</li>
                  <li>Contest the decision</li>
                  <li>Receive an explanation of the decision reached</li>
                </ul>
                <p>
                  We do not make fully automated decisions that produce legal or similarly significant effects without human oversight.
                </p>
              </section>

              <section id="complaints" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">13. Complaints</h2>
                <p>
                  If you have concerns about how we handle your personal data, we encourage you to contact us first so we can try to resolve the issue.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Internal Complaints</h3>
                <p>
                  Contact our Data Protection Lead at dpo@off-the-markets.co.uk. We aim to respond to complaints within 10 working days and resolve them within 30 days.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Supervisory Authority</h3>
                <p>
                  You have the right to lodge a complaint with the Information Commissioner's Office (ICO) if you believe we have not handled your data in accordance with data protection law.
                </p>
                <div className="bg-muted/50 p-6 rounded-lg my-4">
                  <h4 className="font-semibold mb-3">ICO Contact Details</h4>
                  <ul className="list-none space-y-2 pl-0 mb-0">
                    <li><strong>Website:</strong> <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ico.org.uk</a></li>
                    <li><strong>Helpline:</strong> 0303 123 1113</li>
                    <li><strong>Post:</strong> Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF</li>
                  </ul>
                </div>
              </section>

              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-bold mb-4">14. Contact & Requests</h2>
                <p>
                  For any questions about this GDPR Policy, our data practices, or to exercise your rights, please contact us:
                </p>
                <div className="bg-muted/50 p-6 rounded-lg my-6">
                  <ul className="list-none space-y-2 pl-0 mb-0">
                    <li><strong>Data Protection Lead:</strong> dpo@off-the-markets.co.uk</li>
                    <li><strong>General Privacy Queries:</strong> privacy@off-the-markets.co.uk</li>
                    <li><strong>Post:</strong> Data Protection Lead, Off The Markets Ltd, [Company Address]</li>
                  </ul>
                </div>
                <p>
                  We will endeavour to respond to all queries within 5 working days and action requests within the timeframes specified in this policy.
                </p>
                <p>
                  This GDPR Policy should be read alongside our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, <a href="/terms" className="text-primary hover:underline">Terms of Service</a>, and <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.
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
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg z-50"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </Layout>
  );
};

export default GDPR;
