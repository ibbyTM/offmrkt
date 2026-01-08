import { Link } from "react-router-dom";
import { ArrowLeft, Scale, Plus } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
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
    <Layout>
      {/* Page Header */}
      <div className="bg-background-secondary border-b border-border">
        <div className="container py-8 md:py-12">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="ghost" size="icon">
              <Link to="/properties">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Compare Properties
              </h1>
              <p className="text-muted-foreground">
                {selectedProperties.length} of {maxProperties} properties selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {canAddMore && (
              <Button asChild variant="outline" size="sm">
                <Link to="/properties">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add More Properties
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
        </div>
      </div>

      <div className="container py-8">
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
    </Layout>
  );
};

export default Compare;
