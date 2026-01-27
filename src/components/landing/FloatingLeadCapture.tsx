import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle, X, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const leadSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  interest_type: z.enum(["investor", "seller", "both", "not_sure"]).optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export function FloatingLeadCapture() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      interest_type: "not_sure",
    },
  });

  // Check localStorage on mount and show widget after delay
  useEffect(() => {
    if (localStorage.getItem("lead_submitted")) {
      setIsSubmitted(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: LeadFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("landing_leads").insert({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        interest_type: data.interest_type || "not_sure",
        referrer_url: window.location.href,
      });

      if (error) throw error;

      localStorage.setItem("lead_submitted", "true");
      setIsSubmitted(true);

      toast({
        title: "Thanks for your interest!",
        description: "We'll be in touch shortly.",
      });

      // Hide widget after success
      setTimeout(() => {
        setIsExpanded(false);
        setIsVisible(false);
      }, 3000);
    } catch (error) {
      console.error("Lead submission error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if already submitted or not visible yet
  if (isSubmitted || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className={isMobile ? "fixed inset-x-4 bottom-4" : "w-80"}
          >
            <Card className="shadow-lg border bg-card">
              <CardHeader className="pb-3 relative">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                <CardTitle className="text-lg">Get Exclusive Access</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Full Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="email" placeholder="Email Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="tel" placeholder="Phone Number (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interest_type"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="I'm interested in..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="investor">Buying/Investing</SelectItem>
                              <SelectItem value="seller">Selling a Property</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                              <SelectItem value="not_sure">Not Sure Yet</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                      <Check className="h-3 w-3 text-primary" />
                      No spam, ever
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={() => setIsExpanded(true)}
              size="lg"
              className="rounded-full shadow-lg h-14 px-6 gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Get Exclusive Access</span>
              <span className="sm:hidden">Get Started</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
