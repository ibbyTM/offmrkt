import { FileCheck, FileX, Download } from "lucide-react";
import { Property } from "@/lib/propertyUtils";
import { cn } from "@/lib/utils";

interface ComplianceDocumentsProps {
  property: Property;
}

const complianceItems = [
  { key: "has_epc" as const, label: "EPC Certificate", description: "Energy Performance Certificate" },
  { key: "has_gas_safety" as const, label: "Gas Safety Certificate", description: "Annual gas safety check" },
  { key: "has_eicr" as const, label: "EICR", description: "Electrical Installation Report" },
  { key: "has_floor_plans" as const, label: "Floor Plans", description: "Property floor plans available" },
];

export default function ComplianceDocuments({ property }: ComplianceDocumentsProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="text-lg font-bold text-foreground mb-4">Compliance Documents</h3>
      
      <div className="space-y-3">
        {complianceItems.map((item) => {
          const isAvailable = property[item.key];
          
          return (
            <div
              key={item.key}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                isAvailable ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                {isAvailable ? (
                  <FileCheck className="h-5 w-5 text-emerald-600" />
                ) : (
                  <FileX className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    isAvailable ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              
              {isAvailable && (
                <button className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors">
                  <Download className="h-4 w-4 text-emerald-600" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {property.epc_rating && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Current EPC Rating</p>
          <p className="text-2xl font-bold text-foreground">{property.epc_rating}</p>
        </div>
      )}
    </div>
  );
}
