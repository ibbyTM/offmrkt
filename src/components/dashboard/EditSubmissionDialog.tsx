import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserSubmissions, SellerSubmission } from "@/hooks/useUserSubmissions";
import { Loader2 } from "lucide-react";

const editSchema = z.object({
  property_address: z.string().min(5, "Address must be at least 5 characters"),
  property_city: z.string().min(2, "City must be at least 2 characters"),
  property_postcode: z.string().min(5, "Postcode must be at least 5 characters"),
  property_type: z.enum([
    "terraced",
    "semi_detached",
    "detached",
    "flat",
    "bungalow",
    "commercial",
    "land",
    "hmo",
    "other",
  ]),
  asking_price: z.coerce.number().min(1000, "Price must be at least £1,000"),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  property_description: z.string().max(2000).optional(),
  current_monthly_rent: z.coerce.number().min(0).optional(),
  estimated_monthly_rent: z.coerce.number().min(0).optional(),
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditSubmissionDialogProps {
  submission: SellerSubmission | null;
  onClose: () => void;
}

const propertyTypeLabels: Record<string, string> = {
  terraced: "Terraced",
  semi_detached: "Semi-Detached",
  detached: "Detached",
  flat: "Flat",
  bungalow: "Bungalow",
  commercial: "Commercial",
  land: "Land",
  hmo: "HMO",
  other: "Other",
};

export function EditSubmissionDialog({ submission, onClose }: EditSubmissionDialogProps) {
  const { updateSubmission } = useUserSubmissions();
  
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      property_address: "",
      property_city: "",
      property_postcode: "",
      property_type: "terraced",
      asking_price: 0,
      bedrooms: undefined,
      bathrooms: undefined,
      property_description: "",
      current_monthly_rent: undefined,
      estimated_monthly_rent: undefined,
    },
  });

  // Reset form when submission changes
  useEffect(() => {
    if (submission) {
      form.reset({
        property_address: submission.property_address,
        property_city: submission.property_city,
        property_postcode: submission.property_postcode,
        property_type: submission.property_type,
        asking_price: submission.asking_price,
        bedrooms: submission.bedrooms || undefined,
        bathrooms: submission.bathrooms || undefined,
        property_description: submission.property_description || "",
        current_monthly_rent: submission.current_monthly_rent || undefined,
        estimated_monthly_rent: submission.estimated_monthly_rent || undefined,
      });
    }
  }, [submission, form]);

  const onSubmit = async (data: EditFormValues) => {
    if (!submission) return;

    await updateSubmission.mutateAsync({
      id: submission.id,
      updates: {
        property_address: data.property_address,
        property_city: data.property_city,
        property_postcode: data.property_postcode,
        property_type: data.property_type,
        asking_price: data.asking_price,
        bedrooms: data.bedrooms || null,
        bathrooms: data.bathrooms || null,
        property_description: data.property_description || null,
        current_monthly_rent: data.current_monthly_rent || null,
        estimated_monthly_rent: data.estimated_monthly_rent || null,
      },
    });
    
    onClose();
  };

  return (
    <Dialog open={!!submission} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property Submission</DialogTitle>
          <DialogDescription>
            Update the details of your property submission. Changes can only be made while the submission is pending review.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Address */}
            <FormField
              control={form.control}
              name="property_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Example Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City & Postcode */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="property_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
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
                    <FormLabel>Postcode</FormLabel>
                    <FormControl>
                      <Input placeholder="M1 1AA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Property Type & Price */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
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
                    <FormLabel>Asking Price (£)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="250000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="3" {...field} />
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
                      <Input type="number" placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Rent Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="current_monthly_rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Monthly Rent (£)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimated_monthly_rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Monthly Rent (£)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="property_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the property..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateSubmission.isPending}>
                {updateSubmission.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
