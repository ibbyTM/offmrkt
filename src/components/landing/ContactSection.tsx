import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@offmrkt.com",
    href: "mailto:hello@offmrkt.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+44 (0) 20 1234 5678",
    href: "tel:+442012345678",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "London, United Kingdom",
  },
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Message sent! We'll get back to you soon.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get In Touch
            </h2>
            <p className="text-muted-foreground mb-8">
              Have a question or ready to start investing? Send us a message and 
              we'll get back to you within 24 hours.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Your name"
                    required
                    className="bg-card"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your email"
                    required
                    className="bg-card"
                  />
                </div>
              </div>
              <div>
                <Input
                  placeholder="Subject"
                  required
                  className="bg-card"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your message"
                  rows={5}
                  required
                  className="bg-card resize-none"
                />
              </div>
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
          
          {/* Right - Contact info and map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Contact cards */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <Card key={info.label} className="p-4 border-border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{info.label}</div>
                      {info.href ? (
                        <a 
                          href={info.href} 
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="font-medium text-foreground">{info.value}</div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Map placeholder */}
            <Card className="aspect-[4/3] border-border bg-muted/30 flex items-center justify-center overflow-hidden">
              <div className="text-center p-6">
                <MapPin className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Located in the heart of London's financial district
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
