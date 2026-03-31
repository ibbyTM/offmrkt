import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const questionnaireSchema = z.object({
  // Step 1: Financial Qualification
  cashAvailable: z.string().min(1, "Please select your available cash"),
  mortgageApproved: z.boolean(),
  fundingSource: z.string().min(1, "Please select your funding source"),
  
  // Step 2: Investment Strategy
  preferredStrategies: z.array(z.string()).min(1, "Select at least one strategy"),
  preferredLocations: z.array(z.string()).min(1, "Select at least one location"),
  minBudget: z.number().min(10000, "Minimum budget must be at least £10,000"),
  maxBudget: z.number().min(10000, "Maximum budget must be at least £10,000"),
  targetYield: z.number().optional(),
  
  // Step 3: Purchase Intent
  purchaseTimeline: z.string().min(1, "Please select your timeline"),
  propertiesToAcquire: z.number().min(1, "Please enter number of properties"),
  decisionMaker: z.boolean(),
  
  // Step 4: Support Services
  needsMortgageBroker: z.boolean().default(false),
  needsSolicitor: z.boolean().default(false),
  needsPropertyManagement: z.boolean().default(false),
  needsRefurbTeam: z.boolean().default(false),
  
  // Step 5: Experience & Verification
  investmentExperience: z.string().min(1, "Please select your experience level"),
  propertiesOwned: z.number().min(0),
  referralSource: z.string().optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;

const STEPS = [
  { id: 1, title: "Financial", description: "Your budget & funding" },
  { id: 2, title: "Strategy", description: "Investment preferences" },
  { id: 3, title: "Intent", description: "Purchase timeline" },
  { id: 4, title: "Support", description: "Services needed" },
  { id: 5, title: "Experience", description: "Your background" },
];

const CASH_OPTIONS = [
  { value: "under_25k", label: "Under £25,000" },
  { value: "25k_50k", label: "£25,000 - £50,000" },
  { value: "50k_100k", label: "£50,000 - £100,000" },
  { value: "100k_250k", label: "£100,000 - £250,000" },
  { value: "250k_500k", label: "£250,000 - £500,000" },
  { value: "over_500k", label: "Over £500,000" },
];

const FUNDING_SOURCES = [
  { value: "savings", label: "Personal Savings" },
  { value: "mortgage", label: "Mortgage Finance" },
  { value: "bridging", label: "Bridging Finance" },
  { value: "investor", label: "Joint Venture / Investor" },
  { value: "pension", label: "Pension / SSAS" },
  { value: "mixed", label: "Mixed Funding" },
];

const STRATEGIES = [
  { value: "btl", label: "Buy-to-Let" },
  { value: "brrr", label: "BRRR Strategy" },
  { value: "hmo", label: "HMO / Multi-Let" },
  { value: "social_housing", label: "Social Housing / SA" },
  { value: "flip", label: "Flip / Development" },
  { value: "commercial", label: "Commercial Property" },
];

const LOCATIONS = [
  { value: "north_west", label: "North West" },
  { value: "north_east", label: "North East" },
  { value: "yorkshire", label: "Yorkshire" },
  { value: "midlands", label: "Midlands" },
  { value: "wales", label: "Wales" },
  { value: "scotland", label: "Scotland" },
  { value: "south_west", label: "South West" },
  { value: "south_east", label: "South East" },
  { value: "london", label: "London" },
];

const TIMELINES = [
  { value: "immediately", label: "Ready to buy immediately" },
  { value: "1_month", label: "Within 1 month" },
  { value: "3_months", label: "Within 3 months" },
  { value: "6_months", label: "Within 6 months" },
  { value: "researching", label: "Still researching" },
];

const EXPERIENCE_LEVELS = [
  { value: "none", label: "Complete beginner" },
  { value: "some_knowledge", label: "Some knowledge, no purchases yet" },
  { value: "1_2_properties", label: "Own 1-2 investment properties" },
  { value: "3_5_properties", label: "Own 3-5 investment properties" },
  { value: "experienced", label: "Experienced investor (6+ properties)" },
];

export const QuestionnaireForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshInvestorStatus } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      cashAvailable: "",
      mortgageApproved: false,
      fundingSource: "",
      preferredStrategies: [],
      preferredLocations: [],
      minBudget: 50000,
      maxBudget: 200000,
      targetYield: undefined,
      purchaseTimeline: "",
      propertiesToAcquire: 1,
      decisionMaker: true,
      needsMortgageBroker: false,
      needsSolicitor: false,
      needsPropertyManagement: false,
      needsRefurbTeam: false,
      investmentExperience: "",
      propertiesOwned: 0,
      referralSource: "",
      agreedToTerms: false,
    },
    mode: "onChange",
  });

  const validateCurrentStep = async () => {
    const fieldsToValidate: (keyof QuestionnaireFormData)[][] = [
      ["cashAvailable", "mortgageApproved", "fundingSource"],
      ["preferredStrategies", "preferredLocations", "minBudget", "maxBudget"],
      ["purchaseTimeline", "propertiesToAcquire", "decisionMaker"],
      ["needsMortgageBroker", "needsSolicitor", "needsPropertyManagement", "needsRefurbTeam"],
      ["investmentExperience", "propertiesOwned", "agreedToTerms"],
    ];

    const result = await form.trigger(fieldsToValidate[currentStep - 1]);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: QuestionnaireFormData) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("investor_applications").insert({
        user_id: user.id,
        cash_available: data.cashAvailable,
        mortgage_approved: data.mortgageApproved,
        funding_source: data.fundingSource,
        preferred_strategies: data.preferredStrategies,
        preferred_locations: data.preferredLocations,
        min_budget: data.minBudget,
        max_budget: data.maxBudget,
        target_yield: data.targetYield || null,
        purchase_timeline: data.purchaseTimeline,
        properties_to_acquire: data.propertiesToAcquire,
        decision_maker: data.decisionMaker,
        needs_mortgage_broker: data.needsMortgageBroker,
        needs_solicitor: data.needsSolicitor,
        needs_property_management: data.needsPropertyManagement,
        needs_refurb_team: data.needsRefurbTeam,
        investment_experience: data.investmentExperience,
        properties_owned: data.propertiesOwned,
        referral_source: data.referralSource || null,
        agreed_to_terms: data.agreedToTerms,
      });

      if (error) throw error;

      // Send welcome email
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile?.email) {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "welcome-application",
            recipientEmail: profile.email,
            idempotencyKey: `welcome-app-${user.id}`,
            templateData: { name: profile.full_name?.split(" ")[0] || "Investor" },
          },
        });
      }

      await refreshInvestorStatus();

      toast({
        title: "Application submitted!",
        description: "Your investor application is now under review.",
      });

      navigate("/application-status");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="text-xs mt-1 text-muted-foreground hidden sm:block">
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-8 sm:w-16 h-1 mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Financial Qualification */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Financial Qualification</h2>
                <p className="text-muted-foreground">Tell us about your investment budget</p>
              </div>

              <FormField
                control={form.control}
                name="cashAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How much cash do you have available to invest?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your available cash" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CASH_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mortgageApproved"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Do you have a mortgage agreement in principle?</FormLabel>
                      <FormDescription>
                        This helps us understand your buying power
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fundingSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary funding source</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select funding source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FUNDING_SOURCES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 2: Investment Strategy */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Investment Strategy</h2>
                <p className="text-muted-foreground">What type of investments are you looking for?</p>
              </div>

              <FormField
                control={form.control}
                name="preferredStrategies"
                render={() => (
                  <FormItem>
                    <FormLabel>Preferred investment strategies</FormLabel>
                    <FormDescription>Select all that apply</FormDescription>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {STRATEGIES.map((strategy) => (
                        <FormField
                          key={strategy.value}
                          control={form.control}
                          name="preferredStrategies"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(strategy.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, strategy.value])
                                      : field.onChange(field.value?.filter((v) => v !== strategy.value));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {strategy.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredLocations"
                render={() => (
                  <FormItem>
                    <FormLabel>Preferred locations</FormLabel>
                    <FormDescription>Select areas you're interested in</FormDescription>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {LOCATIONS.map((location) => (
                        <FormField
                          key={location.value}
                          control={form.control}
                          name="preferredLocations"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(location.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, location.value])
                                      : field.onChange(field.value?.filter((v) => v !== location.value));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer text-sm">
                                {location.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum budget (£)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum budget (£)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="targetYield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target yield (% - optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 8.5"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 3: Purchase Intent */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Purchase Intent</h2>
                <p className="text-muted-foreground">When are you looking to invest?</p>
              </div>

              <FormField
                control={form.control}
                name="purchaseTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>When do you plan to make your next purchase?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your timeline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIMELINES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertiesToAcquire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How many properties do you want to acquire in the next 12 months?</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decisionMaker"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Are you the sole decision maker?</FormLabel>
                      <FormDescription>
                        Or will you need to consult with partners/family?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 4: Support Services */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Support Services</h2>
                <p className="text-muted-foreground">What services would help your investment journey?</p>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="needsMortgageBroker"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mortgage Broker Introduction</FormLabel>
                        <FormDescription>
                          Connect with specialist buy-to-let mortgage brokers
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="needsSolicitor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Conveyancing Solicitor</FormLabel>
                        <FormDescription>
                          Recommended solicitors experienced with investment properties
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="needsPropertyManagement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Property Management</FormLabel>
                        <FormDescription>
                          Hands-off management for your rental properties
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="needsRefurbTeam"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Refurbishment Team</FormLabel>
                        <FormDescription>
                          Trusted contractors for property renovations
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 5: Experience & Verification */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Experience & Verification</h2>
                <p className="text-muted-foreground">Tell us about your investment background</p>
              </div>

              <FormField
                control={form.control}
                name="investmentExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your property investment experience?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertiesOwned"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How many investment properties do you currently own?</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referralSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How did you hear about us? (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Google, friend, social media" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreedToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/50">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I agree to the terms and conditions</FormLabel>
                      <FormDescription>
                        By checking this box, you confirm the information provided is accurate and you consent to be contacted about investment opportunities.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < 5 ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
