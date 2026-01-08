import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calculator, Zap, FileText } from "lucide-react";
import { Property } from "@/lib/propertyUtils";
import StampDutyCalculator from "./StampDutyCalculator";

interface PropertyAccordionsProps {
  property: Property;
}

const epcColors: Record<string, string> = {
  A: "bg-emerald-500",
  B: "bg-emerald-400",
  C: "bg-lime-400",
  D: "bg-yellow-400",
  E: "bg-orange-400",
  F: "bg-orange-500",
  G: "bg-red-500",
};

export default function PropertyAccordions({ property }: PropertyAccordionsProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {/* Stamp Duty Calculator */}
      <AccordionItem value="stamp-duty" className="border border-border rounded-xl px-4 bg-card">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calculator className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">Stamp Duty Calculator</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <StampDutyCalculator propertyPrice={property.asking_price} />
        </AccordionContent>
      </AccordionItem>

      {/* EPC Rating */}
      <AccordionItem value="epc" className="border border-border rounded-xl px-4 bg-card">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">EPC Rating</span>
            {property.epc_rating && (
              <span className={`ml-2 px-2 py-0.5 text-xs font-bold text-white rounded ${epcColors[property.epc_rating] || "bg-gray-400"}`}>
                {property.epc_rating}
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          {property.epc_rating ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold text-white ${epcColors[property.epc_rating] || "bg-gray-400"}`}>
                  {property.epc_rating}
                </div>
                <div>
                  <p className="font-medium">Energy Performance Certificate</p>
                  <p className="text-sm text-muted-foreground">
                    Rating {property.epc_rating} on a scale of A to G
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {["A", "B", "C", "D", "E", "F", "G"].map((rating) => (
                  <div
                    key={rating}
                    className={`flex-1 h-2 rounded-full ${epcColors[rating]} ${
                      rating === property.epc_rating ? "ring-2 ring-foreground ring-offset-2" : "opacity-40"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">EPC rating not available for this property.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Terms */}
      <AccordionItem value="terms" className="border border-border rounded-xl px-4 bg-card">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">Reservation Terms</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Reservation Fee:</strong> A reservation fee 
              secures this property exclusively for you for 28 days.
            </p>
            <p>
              <strong className="text-foreground">Due Diligence:</strong> During this period, 
              you can conduct full due diligence including surveys and legal checks.
            </p>
            <p>
              <strong className="text-foreground">Refund Policy:</strong> The reservation fee 
              is fully refundable if the property fails any standard due diligence checks.
            </p>
            <p>
              <strong className="text-foreground">Exchange:</strong> Upon satisfactory due 
              diligence, you will proceed to exchange contracts.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
