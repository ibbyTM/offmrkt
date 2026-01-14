import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How do I create an account?",
    answer: "Creating an account is simple. Click 'Get Started' and complete our short investor questionnaire. Once submitted, our team will review your application and you'll receive access within 24-48 hours.",
  },
  {
    question: "What makes OffMrkt different from other platforms?",
    answer: "OffMrkt exclusively features off-market properties that aren't listed elsewhere. Every property undergoes thorough due diligence, and all sellers are verified. We provide detailed investment analytics including ROI projections, yield calculations, and market comparisons.",
  },
  {
    question: "How are the properties vetted?",
    answer: "Our team conducts comprehensive checks on every property including title verification, EPC ratings, rental income verification, and local market analysis. We also verify all seller documentation and ensure properties meet our quality standards.",
  },
  {
    question: "Can I reserve a property before viewing?",
    answer: "Yes, you can place a refundable reservation on any property to take it off the market while you conduct your due diligence. This gives you exclusive access to the property for an agreed period.",
  },
  {
    question: "What support do you offer investors?",
    answer: "We offer tiered support based on your plan. All investors receive email support and community access. Pro and Premium members get priority support, 1-on-1 calls, and access to our network of recommended solicitors, mortgage brokers, and property managers.",
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach our support team via email at support@offmrkt.com, through the in-app chat feature, or by scheduling a call through your dashboard. Premium members have access to a dedicated account manager.",
  },
];

export function FAQSection() {
  const [openItem, setOpenItem] = useState<string | undefined>("item-0");

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Common Questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about getting started with OffMrkt.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion
              type="single"
              collapsible
              value={openItem}
              onValueChange={setOpenItem}
              className="space-y-4"
            >
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
