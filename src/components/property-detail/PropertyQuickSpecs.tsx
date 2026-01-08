import { Building2, Bed, Bath, Maximize, Key } from "lucide-react";
import { Property, propertyTypeLabels } from "@/lib/propertyUtils";

interface PropertyQuickSpecsProps {
  property: Property;
}

export default function PropertyQuickSpecs({ property }: PropertyQuickSpecsProps) {
  const specs = [
    {
      icon: Building2,
      label: "TYPE",
      value: propertyTypeLabels[property.property_type] || property.property_type,
    },
    {
      icon: Bed,
      label: "BEDROOMS",
      value: property.bedrooms || "—",
    },
    {
      icon: Bath,
      label: "BATHROOMS",
      value: property.bathrooms || "—",
    },
    {
      icon: Maximize,
      label: "SIZE",
      value: property.square_feet ? `${property.square_feet.toLocaleString()} sq ft` : "—",
    },
    {
      icon: Key,
      label: "TENURE",
      value: property.tenure || "TBC",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-xl border border-border">
      {specs.map((spec) => (
        <div key={spec.label} className="text-center">
          <div className="flex justify-center mb-2">
            <spec.icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground font-medium tracking-wide">{spec.label}</p>
          <p className="font-semibold text-foreground">{spec.value}</p>
        </div>
      ))}
    </div>
  );
}
