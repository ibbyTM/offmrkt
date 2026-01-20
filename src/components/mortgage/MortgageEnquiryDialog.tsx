import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, CheckCircle2, Phone } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { formatPrice } from "@/lib/propertyUtils";

const formSchema = z.object({
  full_name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email required").max(255),
  phone: z.string().max(20).optional(),
  enquiry_type: z.enum(["purchase", "remortgage"]),
  annual_income: z.string().optional(),
  has_aip: z.boolean(),
  purchase_timeline: z.string().optional(),
  is_uk_resident: z.boolean(),
  prefers_remote: z.boolean(),
  message: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MortgageEnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Tables<"properties"> | null;
  userId: string;
  brokerPhone: string;
}

export function MortgageEnquiryDialog({
  open,
  onOpenChange,
  property,
  userId,
  brokerPhone,
}: MortgageEnquiryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [investorData, setInvestorData] = useState<Tables<"investor_applications"> | null>(null);
  const [profileData, setProfileData] = useState<Tables<"profiles"> | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      enquiry_type: "purchase",
      annual_income: "",
      has_aip: false,
      purchase_timeline: "",
      is_uk_resident: true,
      prefers_remote: true,
      message: "",
    },
  });

  // Load user data and pre-fill form
  useEffect(() => {
    if (open && userId) {
      const loadUserData = async () => {
        const [investorResult, profileResult] = await Promise.all([
          supabase.from("investor_applications").select("*").eq("user_id", userId).single(),
          supabase.from("profiles").select("*").eq("user_id", userId).single(),
        ]);

        if (profileResult.data) {
          setProfileData(profileResult.data);
          form.setValue("full_name", profileResult.data.full_name || "");
          form.setValue("email", profileResult.data.email || "");
          form.setValue("phone", profileResult.data.phone || "");
        }

        if (investorResult.data) {
          setInvestorData(investorResult.data);
          form.setValue("has_aip", investorResult.data.mortgage_approved || false);
          form.setValue("purchase_timeline", investorResult.data.purchase_timeline || "");
        }
      };

      loadUserData();
    }
  }, [open, userId, form]);

  // Reset success state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsSuccess(false);
    }
  }, [open]);

  const deposit = property ? Math.round(property.asking_price * 0.25) : 0;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const incomeValue = data.annual_income 
        ? parseInt(data.annual_income.replace(/[^0-9]/g, "")) || undefined
        : undefined;

      const payload = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || "",
        enquiry_type: data.enquiry_type,
        message: data.message || "",
        annual_income: incomeValue,
        has_aip: data.has_aip,
        budget_min: investorData?.min_budget || undefined,
        budget_max: investorData?.max_budget || undefined,
        cash_available: investorData?.cash_available || undefined,
        funding_source: investorData?.funding_source || undefined,
        properties_owned: investorData?.properties_owned ?? 0,
        investment_experience: investorData?.investment_experience || undefined,
        purchase_timeline: data.purchase_timeline || undefined,
        is_uk_resident: data.is_uk_resident,
        prefers_remote: data.prefers_remote,
        property_id: property?.id || undefined,
        property_address: property 
          ? `${property.property_address}, ${property.property_city} ${property.property_postcode}` 
          : undefined,
        property_value: property?.asking_price || undefined,
        property_type: property?.property_type || undefined,
        deposit_amount: deposit || undefined,
      };

      const { data: session } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("mortgage-enquiry", {
        body: payload,
        headers: {
          Authorization: `Bearer ${session?.session?.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to submit enquiry");
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      form.setError("root", { 
        message: error instanceof Error ? error.message : "Something went wrong. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallBroker = () => {
    window.location.href = `tel:${brokerPhone.replace(/\s/g, "")}`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Enquiry Sent!</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Paul will be in touch within 24 hours. We've also notified the OffMrkt team.
            </p>
            <div className="space-y-3 w-full max-w-xs">
              <Button 
                onClick={() => onOpenChange(false)} 
                className="w-full"
              >
                Back to Property
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCallBroker}
                className="w-full"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Paul Now
              </Button>
            </div>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Mortgage Enquiry</SheetTitle>
              <SheetDescription>
                Fill in your details and Paul will get back to you within 24 hours.
              </SheetDescription>
            </SheetHeader>

            {property && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
                <p className="font-medium">{property.title}</p>
                <p className="text-muted-foreground">
                  {formatPrice(property.asking_price)} • Deposit: {formatPrice(deposit)}
                </p>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-6">
                {/* Contact Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Your Details</h3>
                  
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
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
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="07700 900123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Enquiry Type */}
                <FormField
                  control={form.control}
                  name="enquiry_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enquiry Type *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="purchase" id="dialog-purchase" />
                            <label htmlFor="dialog-purchase" className="text-sm cursor-pointer">
                              New Purchase
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="remortgage" id="dialog-remortgage" />
                            <label htmlFor="dialog-remortgage" className="text-sm cursor-pointer">
                              Remortgage
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Financial Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Financial Details</h3>

                  <FormField
                    control={form.control}
                    name="annual_income"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approximate Annual Income</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. £50,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="has_aip"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          I already have an Agreement in Principle (AIP)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Timing */}
                <FormField
                  control={form.control}
                  name="purchase_timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When are you looking to buy?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="immediate">Immediately - ready now</SelectItem>
                          <SelectItem value="0-3_months">Within 3 months</SelectItem>
                          <SelectItem value="3-6_months">3-6 months</SelectItem>
                          <SelectItem value="6-12_months">6-12 months</SelectItem>
                          <SelectItem value="12+_months">12+ months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preferences */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Preferences</h3>

                  <FormField
                    control={form.control}
                    name="is_uk_resident"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          I am a UK resident
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prefers_remote"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Happy with online/remote service
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any specific questions or requirements?"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                  </p>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Enquiry
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you agree to be contacted by our mortgage partner.
                </p>
              </form>
            </Form>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
