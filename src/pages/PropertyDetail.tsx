import { useParams, Link } from "react-router-dom";
import { useProperty } from "@/hooks/useProperties";
import { useIsAdmin } from "@/hooks/useAdminApplications";
import { AppLayout } from "@/components/layout/AppLayout";
import PropertyGallery from "@/components/property-detail/PropertyGallery";
import FloorPlans from "@/components/property-detail/FloorPlans";
import PropertyHeader from "@/components/property-detail/PropertyHeader";
import PropertyQuickSpecs from "@/components/property-detail/PropertyQuickSpecs";
import FinancialStatsGrid from "@/components/property-detail/FinancialStatsGrid";
import PropertyDescription from "@/components/property-detail/PropertyDescription";
import InvestmentHighlights from "@/components/property-detail/InvestmentHighlights";
import PropertyAccordions from "@/components/property-detail/PropertyAccordions";
import ROIBreakdown from "@/components/property-detail/ROIBreakdown";
import AIPropertyAnalysis from "@/components/property-detail/AIPropertyAnalysis";
import ComplianceDocuments from "@/components/property-detail/ComplianceDocuments";
import PropertyCTAs from "@/components/property-detail/PropertyCTAs";
import { AdminPropertyToolbar } from "@/components/property-detail/AdminPropertyToolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Building2, Loader2 } from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error } = useProperty(id || "");
  const { data: isAdmin } = useIsAdmin();

  if (isLoading) {
    return (
      <AppLayout pageTitle="Loading..." pageIcon={<Building2 className="h-5 w-5" />}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-xl" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !property) {
    return (
      <AppLayout pageTitle="Property Not Found" pageIcon={<Building2 className="h-5 w-5" />}>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/properties">Back to Properties</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      pageTitle={property.title} 
      pageSubtitle={`${property.property_city} · ${property.property_postcode}`}
      pageIcon={<Building2 className="h-5 w-5" />}
    >
      <div className="container mx-auto px-4 py-8">
        {isAdmin && <AdminPropertyToolbar property={property} />}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PropertyGallery photos={property.photo_urls || []} title={property.title} />
            <PropertyHeader property={property} />
            <PropertyQuickSpecs property={property} />
            <FinancialStatsGrid property={property} />
            <PropertyDescription description={property.property_description} />
            <FloorPlans floorPlanUrls={property.floor_plan_urls || []} />
            <InvestmentHighlights property={property} />
            <AIPropertyAnalysis property={property} />
            <PropertyAccordions property={property} />
            <ROIBreakdown property={property} />
          </div>
          <div className="space-y-6">
            <PropertyCTAs property={property} />
            <ComplianceDocuments property={property} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
