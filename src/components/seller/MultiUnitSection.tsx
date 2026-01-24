import { useFormContext } from "react-hook-form";
import { Building, Layers } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { SellerFormValues } from "./sellerFormSchema";

interface MultiUnitSectionProps {
  city: string;
  postcode: string;
}

export function MultiUnitSection({ city, postcode }: MultiUnitSectionProps) {
  const form = useFormContext<SellerFormValues>();
  const isMultiUnit = form.watch("is_multi_unit");
  const buildingName = form.watch("building_name");
  const unitFrom = form.watch("unit_from");
  const unitTo = form.watch("unit_to");

  // Calculate number of units and generate preview
  const unitCount = unitFrom && unitTo && unitTo >= unitFrom 
    ? unitTo - unitFrom + 1 
    : 0;
  
  const previewUnits = [];
  if (unitCount > 0 && buildingName) {
    const maxPreview = Math.min(unitCount, 3);
    for (let i = 0; i < maxPreview; i++) {
      previewUnits.push(`Unit ${unitFrom! + i}, ${buildingName}`);
    }
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="is_multi_unit"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border p-4 bg-muted/30">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base font-medium cursor-pointer">
                <Layers className="h-4 w-4 inline mr-2" />
                This is a multi-unit property (block of flats, HMO, etc.)
              </FormLabel>
              <FormDescription>
                Submit multiple units at once with shared details
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {isMultiUnit && (
        <div className="space-y-4 p-4 rounded-lg border border-primary/30 bg-primary/5 animate-fade-in">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Building className="h-4 w-4" />
            Multi-Unit Configuration
          </div>

          <FormField
            control={form.control}
            name="building_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Building/Block Name *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Mayfair Court" 
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="unit_from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Unit *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="1"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Unit *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="8"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Preview Section */}
          {unitCount > 0 && buildingName && (
            <div className="mt-4 p-3 rounded-md bg-background border border-border">
              <p className="text-sm font-medium text-foreground mb-2">
                Preview: {unitCount} unit{unitCount !== 1 ? 's' : ''} will be created
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {previewUnits.map((unit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {unit}{city && `, ${city}`}{postcode && `, ${postcode}`}
                  </li>
                ))}
                {unitCount > 3 && (
                  <li className="text-muted-foreground/70 italic">
                    ... and {unitCount - 3} more
                  </li>
                )}
              </ul>
            </div>
          )}

          {unitTo && unitFrom && unitTo < unitFrom && (
            <p className="text-sm text-destructive">
              "To Unit" must be greater than or equal to "From Unit"
            </p>
          )}

          {unitCount > 20 && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              You're submitting {unitCount} units. For very large blocks, consider splitting into multiple submissions.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
