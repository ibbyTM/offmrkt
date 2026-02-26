import { useState } from "react";
import { Maximize2, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FloorPlansProps {
  floorPlanUrls: string[];
}

const isPdf = (url: string) => url.toLowerCase().split('?')[0].endsWith('.pdf');

export default function FloorPlans({ floorPlanUrls }: FloorPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (floorPlanUrls.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Floor Plans</h2>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {floorPlanUrls.map((url, index) =>
            isPdf(url) ? (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-3 h-48 bg-muted rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <FileText className="h-12 w-12 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  View Floor Plan (PDF)
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            ) : (
              <div
                key={index}
                className="relative group cursor-pointer"
                onClick={() => setSelectedPlan(url)}
              >
                <img
                  src={url}
                  alt={`Floor Plan ${index + 1}`}
                  className="w-full h-48 object-contain bg-muted rounded-lg"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors rounded-lg flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="h-4 w-4 mr-2" />
                    View Full Size
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Floor Plan</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            isPdf(selectedPlan) ? (
              <div className="space-y-4">
                <object data={selectedPlan} type="application/pdf" className="w-full h-[70vh]">
                  <p className="text-center text-muted-foreground py-8">
                    Unable to display PDF inline.{" "}
                    <a href={selectedPlan} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      Open in new tab
                    </a>
                  </p>
                </object>
              </div>
            ) : (
              <img
                src={selectedPlan}
                alt="Floor Plan Full Size"
                className="w-full h-auto"
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
