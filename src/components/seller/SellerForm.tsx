import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { 
  Building2, 
  FileText, 
  Camera, 
  User, 
  CheckCircle2,
  Loader2,
  LogIn,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PhotoUpload } from "./PhotoUpload";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { MultiUnitSection } from "./MultiUnitSection";
import {
  sellerFormSchema,
  SellerFormValues,
  propertyTypeLabels,
  sellingReasonLabels,
  propertyStatusLabels,
  timelineLabels,
  epcRatings,
} from "./sellerFormSchema";

const STORAGE_KEY = "seller_form_draft";

const steps = [
  { id: 1, title: "Property Details", icon: Building2 },
  { id: 2, title: "Status & Timeline", icon: FileText },
  { id: 3, title: "Compliance Docs", icon: CheckCircle2 },
  { id: 4, title: "Photos", icon: Camera },
  { id: 5, title: "Contact Info", icon: User },
];

interface SavedDraft {
  values: SellerFormValues;
  photos: string[];
  currentStep: number;
}

export function SellerForm() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerFormSchema),
    defaultValues: {
      property_address: "",
      property_city: "",
      property_postcode: "",
      asking_price: 0,
      bedrooms: undefined,
      bathrooms: undefined,
      property_description: "",
      additional_notes: "",
      has_epc: false,
      has_gas_safety: false,
      has_eicr: false,
      has_floor_plans: false,
      epc_rating: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      is_owner: true,
      company_name: "",
      // Multi-unit defaults
      is_multi_unit: false,
      building_name: "",
      unit_from: undefined,
      unit_to: undefined,
    },
  });

  // Restore draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft: SavedDraft = JSON.parse(savedDraft);
        form.reset(draft.values);
        setPhotos(draft.photos || []);
        setCurrentStep(draft.currentStep || 1);
        setHasDraft(true);
      } catch (e) {
        console.error("Failed to restore draft:", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [form]);

  // Pre-fill user email and name when logged in
  useEffect(() => {
    if (user) {
      // Pre-fill email
      if (user.email && !form.getValues("contact_email")) {
        form.setValue("contact_email", user.email);
      }
      
      // Fetch profile to get full name
      const fetchProfile = async () => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .single();
        
        if (profile?.full_name && !form.getValues("contact_name")) {
          form.setValue("contact_name", profile.full_name);
        }
      };
      
      fetchProfile();
    }
  }, [user, form]);

  // Save draft to localStorage on changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      const draft: SavedDraft = {
        values: values as SellerFormValues,
        photos,
        currentStep,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    });
    return () => subscription.unsubscribe();
  }, [form, photos, currentStep]);

  // Also save when photos or step changes
  useEffect(() => {
    const values = form.getValues();
    const draft: SavedDraft = {
      values,
      photos,
      currentStep,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [photos, currentStep, form]);

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasDraft(false);
    setCurrentStep(1);
    setPhotos([]);
    form.reset();
    toast({
      title: "Draft cleared",
      description: "Your saved progress has been removed.",
    });
  };

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof SellerFormValues)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "property_address",
          "property_city",
          "property_postcode",
          "property_type",
          "asking_price",
        ];
        break;
      case 2:
        fieldsToValidate = ["selling_reason", "current_status", "sale_timeline"];
        break;
      case 3:
        // Compliance docs are optional
        return true;
      case 4:
        // Photos are optional
        return true;
      case 5:
        fieldsToValidate = ["contact_name", "contact_email", "contact_phone"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: SellerFormValues) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to submit a property.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Build base submission object
      const baseSubmission = {
        property_city: data.property_city,
        property_postcode: data.property_postcode,
        property_type: data.property_type,
        asking_price: data.asking_price,
        bedrooms: data.bedrooms || null,
        bathrooms: data.bathrooms || null,
        property_description: data.property_description || null,
        selling_reason: data.selling_reason,
        current_status: data.current_status,
        sale_timeline: data.sale_timeline,
        additional_notes: data.additional_notes || null,
        has_epc: data.has_epc,
        has_gas_safety: data.has_gas_safety,
        has_eicr: data.has_eicr,
        has_floor_plans: data.has_floor_plans,
        epc_rating: data.epc_rating || null,
        current_monthly_rent: data.current_monthly_rent || null,
        estimated_monthly_rent: data.estimated_monthly_rent || null,
        photo_urls: photos.length > 0 ? photos : null,
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        is_owner: data.is_owner,
        company_name: data.company_name || null,
        user_id: user.id,
      };

      let submissions: any[] = [];

      if (data.is_multi_unit && data.unit_from && data.unit_to && data.building_name) {
        // Multi-unit submission: create one record per unit
        for (let i = data.unit_from; i <= data.unit_to; i++) {
          submissions.push({
            ...baseSubmission,
            property_address: `Unit ${i}, ${data.building_name}`,
            is_multi_unit: true,
            building_name: data.building_name,
            unit_number: String(i),
            // First unit is parent, others reference it
            parent_submission_id: null, // Will be set after first insert
          });
        }
      } else {
        // Single property submission
        submissions = [{
          ...baseSubmission,
          property_address: data.property_address,
          is_multi_unit: false,
          building_name: null,
          unit_number: null,
          parent_submission_id: null,
        }];
      }

      // Insert all submissions
      const { data: insertedData, error } = await supabase
        .from("seller_submissions")
        .insert(submissions)
        .select("id");

      if (error) throw error;

      // If multi-unit, update parent_submission_id for child records
      if (data.is_multi_unit && insertedData && insertedData.length > 1) {
        const parentId = insertedData[0].id;
        const childIds = insertedData.slice(1).map(r => r.id);
        
        if (childIds.length > 0) {
          await supabase
            .from("seller_submissions")
            .update({ parent_submission_id: parentId })
            .in("id", childIds);
        }
      }

      // Clear draft on successful submission
      localStorage.removeItem(STORAGE_KEY);
      setIsSubmitted(true);
      
      const unitCount = data.is_multi_unit && data.unit_from && data.unit_to 
        ? data.unit_to - data.unit_from + 1 
        : 1;
      
      toast({
        title: "Submission successful!",
        description: unitCount > 1 
          ? `${unitCount} units submitted. We'll review and be in touch within 24-48 hours.`
          : "We'll review your property and be in touch within 24-48 hours.",
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      
      // Handle rate limit error with user-friendly message
      if (error.message?.includes('Rate limit exceeded')) {
        toast({
          title: "Submission limit reached",
          description: "You can submit up to 5 properties per day. Please try again tomorrow.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Submission failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Property Submitted Successfully!
        </h2>
        <p className="text-muted-foreground mb-8">
          Thank you for your submission. Our team will review your property details
          and contact you within 24-48 hours to discuss next steps.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/")}>
            Return Home
          </Button>
          <Button variant="outline" onClick={() => {
            setIsSubmitted(false);
            setCurrentStep(1);
            setPhotos([]);
            form.reset();
          }}>
            Submit Another Property
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Draft Restored Banner */}
      {hasDraft && (
        <div className="bg-info/10 border border-info/30 rounded-lg p-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-info-foreground">
            We've restored your saved progress.
          </p>
          <Button variant="ghost" size="sm" onClick={clearDraft} className="text-info-foreground hover:text-foreground">
            <Trash2 className="h-4 w-4 mr-1" />
            Start Fresh
          </Button>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    currentStep >= step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground"
                  )}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium hidden sm:block",
                    currentStep >= step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-px w-8 sm:w-16 md:w-24 mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Property Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Property Details</h2>
                  <p className="text-sm text-muted-foreground">Tell us about the property you're selling</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="property_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl>
                      <AddressAutocomplete
                        value={field.value}
                        onChange={field.onChange}
                        onAddressSelect={(address) => {
                          form.setValue("property_address", address.street);
                          form.setValue("property_city", address.city);
                          form.setValue("property_postcode", address.postcode);
                        }}
                        placeholder="Start typing your address..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="property_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Manchester" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="property_postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode *</FormLabel>
                      <FormControl>
                        <Input placeholder="M1 1AA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(propertyTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
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
                name="asking_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asking Price (£) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="250000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="property_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the property, its condition, any recent improvements..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional but helps us understand the property better
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Multi-Unit Property Section */}
              <MultiUnitSection 
                city={form.watch("property_city")}
                postcode={form.watch("property_postcode")}
              />
            </div>
          )}

          {/* Step 2: Status & Timeline */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Status & Timeline</h2>
                  <p className="text-sm text-muted-foreground">Help us understand your selling situation</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="selling_reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Selling *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(sellingReasonLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
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
                name="current_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Property Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select current status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(propertyStatusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
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
                name="sale_timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Sale Timeline *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="When do you need to sell?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(timelineLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rental Income Fields */}
              {form.watch("current_status") === "tenanted" && (
                <FormField
                  control={form.control}
                  name="current_monthly_rent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Monthly Rent (£)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1200"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The actual rent currently being received
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="estimated_monthly_rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Monthly Rent (£)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1500"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your estimate of achievable market rent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additional_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other information that might be relevant..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 3: Compliance Documents */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Compliance Documents</h2>
                  <p className="text-sm text-muted-foreground">Which documents do you have available?</p>
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-border p-6">
                <FormField
                  control={form.control}
                  name="has_epc"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Energy Performance Certificate (EPC)</FormLabel>
                        <FormDescription>
                          Required for most property sales
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("has_epc") && (
                  <FormField
                    control={form.control}
                    name="epc_rating"
                    render={({ field }) => (
                      <FormItem className="ml-7">
                        <FormLabel>EPC Rating</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Rating" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {epcRatings.map((rating) => (
                              <SelectItem key={rating} value={rating}>
                                {rating}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="has_gas_safety"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Gas Safety Certificate</FormLabel>
                        <FormDescription>
                          Required if property has gas appliances
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="has_eicr"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>EICR (Electrical Installation Condition Report)</FormLabel>
                        <FormDescription>
                          Electrical safety certification
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="has_floor_plans"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Floor Plans</FormLabel>
                        <FormDescription>
                          Professional floor plan drawings
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Don't worry if you don't have all documents — we can help arrange these if needed.
              </p>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Property Photos</h2>
                  <p className="text-sm text-muted-foreground">Upload photos of your property (optional but recommended)</p>
                </div>
              </div>

              <PhotoUpload
                photos={photos}
                onPhotosChange={setPhotos}
                maxPhotos={10}
              />

              <div className="rounded-lg bg-accent/50 p-4">
                <p className="text-sm font-medium text-foreground mb-2">Photo Tips:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Include front exterior and rear garden</li>
                  <li>Capture all main rooms (living room, kitchen, bedrooms)</li>
                  <li>Show any unique features or recent improvements</li>
                  <li>Good lighting helps — natural light is best</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 5: Contact Information */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
                  <p className="text-sm text-muted-foreground">How can we reach you?</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="contact_name"
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

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="07123 456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_owner"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I am the property owner</FormLabel>
                      <FormDescription>
                        Uncheck if you're an agent or representative
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {!form.watch("is_owner") && (
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company / Agency Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Auth Required Prompt for Non-Logged-In Users */}
              {!user && (
                <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6 text-center mt-8">
                  <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-foreground">Almost there!</h3>
                  <p className="text-muted-foreground mb-4">
                    Create a free account or log in to submit your property. 
                    Your details are saved and will be here when you return.
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button asChild>
                      <Link to="/register" state={{ returnTo: "/submit-property" }}>
                        Create Account
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/login" state={{ returnTo: "/submit-property" }}>
                        Log In
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button type="button" onClick={nextStep}>
                Continue
              </Button>
            ) : (
              // Only show submit button if user is logged in
              user && (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Property
                </Button>
              )
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
