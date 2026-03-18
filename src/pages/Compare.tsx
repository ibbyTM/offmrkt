import { Link } from "react-router-dom";
import { Scale, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { AppLayout } from "@/components/layout/AppLayout";
import { useComparison } from "@/contexts/ComparisonContext";
import { useProperties } from "@/hooks/useProperties";

const Compare = () => {
  const { selectedProperties, clearSelection, maxProperties } = useComparison();
  const { data: allProperties, isLoading } = useProperties();

  const propertiesToCompare = allProperties?.filter((p) =>
    selectedProperties.includes(p.id)
  ) || [];

  const canAddMore = selectedProperties.length < maxProperties;

  return (
    <AppLayout
      pageTitle="Compare Properties"
      pageSubtitle={`${selectedProperties.length} of ${maxProperties} properties selected`}
      pageIcon={<Scale className="h-5 w-5 text-primary" />}
      headerActions={
        <div className="flex items-center gap-2">
          {canAddMore && (
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link to="/properties">
                <Plus className="h-4 w-4 md:mr-1.5" />
                <span className="hidden md:inline">Add More</span>
              </Link>
            </Button>
          )}
          {selectedProperties.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-muted-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      }
    >
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <ComparisonTable properties={propertiesToCompare} />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Compare;
