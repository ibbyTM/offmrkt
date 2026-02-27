import { z } from "zod";

export const sellerFormSchema = z.object({
  // Property Details
  property_address: z.string().optional().default(""),
  property_city: z.string().min(2, "City is required"),
  property_postcode: z.string().min(5, "Valid postcode is required").max(10),
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
  bedrooms: z.coerce.number().min(0).max(20).optional(),
  bathrooms: z.coerce.number().min(0).max(10).optional(),
  property_description: z.string().max(2000).optional(),

  // Multi-unit property support
  is_multi_unit: z.boolean().default(false),
  building_name: z.string().optional(),
  unit_from: z.coerce.number().min(1).optional(),
  unit_to: z.coerce.number().min(1).optional(),

  // Status Information
  selling_reason: z.enum([
    "quick_sale",
    "relocation",
    "investment_exit",
    "inheritance",
    "divorce",
    "financial",
    "upgrade",
    "downsize",
    "other",
  ]),
  current_status: z.enum([
    "vacant",
    "tenanted",
    "owner_occupied",
    "under_renovation",
  ]),
  sale_timeline: z.enum([
    "asap",
    "within_1_month",
    "within_3_months",
    "within_6_months",
    "flexible",
  ]),
  additional_notes: z.string().max(1000).optional(),
  current_monthly_rent: z.coerce.number().min(0).optional(),
  estimated_monthly_rent: z.coerce.number().min(0).optional(),
  estimated_refurb_cost: z.coerce.number().min(0).optional(),

  // Compliance Documents
  has_epc: z.boolean().default(false),
  has_gas_safety: z.boolean().default(false),
  has_eicr: z.boolean().default(false),
  has_floor_plans: z.boolean().default(false),
  epc_rating: z.string().optional(),

  // Contact Information
  contact_name: z.string().min(2, "Name is required"),
  contact_email: z.string().email("Valid email is required"),
  contact_phone: z.string().min(10, "Valid phone number is required"),
  is_owner: z.boolean().default(true),
  company_name: z.string().optional(),
}).refine((data) => {
  // Street address required for single properties
  if (!data.is_multi_unit) {
    return data.property_address && data.property_address.length >= 5;
  }
  return true;
}, {
  message: "Street address is required for single properties",
  path: ["property_address"],
}).refine((data) => {
  // If multi-unit is enabled, require building_name and unit range
  if (data.is_multi_unit) {
    return data.building_name && data.building_name.length >= 2 && 
           data.unit_from && data.unit_to && data.unit_to >= data.unit_from;
  }
  return true;
}, {
  message: "Multi-unit properties require building name and valid unit range",
  path: ["building_name"],
});

export type SellerFormValues = z.infer<typeof sellerFormSchema>;

export const propertyTypeLabels: Record<string, string> = {
  terraced: "Terraced House",
  semi_detached: "Semi-Detached House",
  detached: "Detached House",
  flat: "Flat / Apartment",
  bungalow: "Bungalow",
  commercial: "Commercial Property",
  land: "Land",
  hmo: "HMO",
  other: "Other",
};

export const sellingReasonLabels: Record<string, string> = {
  quick_sale: "Quick Sale Needed",
  relocation: "Relocating",
  investment_exit: "Exiting Investment",
  inheritance: "Inherited Property",
  divorce: "Divorce / Separation",
  financial: "Financial Reasons",
  upgrade: "Upgrading Property",
  downsize: "Downsizing",
  other: "Other",
};

export const propertyStatusLabels: Record<string, string> = {
  vacant: "Vacant",
  tenanted: "Currently Tenanted",
  owner_occupied: "Owner Occupied",
  under_renovation: "Under Renovation",
};

export const timelineLabels: Record<string, string> = {
  asap: "ASAP",
  within_1_month: "Within 1 Month",
  within_3_months: "Within 3 Months",
  within_6_months: "Within 6 Months",
  flexible: "Flexible",
};

export const epcRatings = ["A", "B", "C", "D", "E", "F", "G"];
