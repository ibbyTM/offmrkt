import { useParams, Link } from "react-router-dom";
import { useProperty } from "@/hooks/useProperties";
import { Layout } from "@/components/layout/Layout";
import PropertyGallery from "@/components/property-detail/PropertyGallery";
import PropertyHeader from "@/components/property-detail/PropertyHeader";
import PropertyQuickSpecs from "@/components/property-detail/PropertyQuickSpecs";
import FinancialStatsGrid from "@/components/property-detail/FinancialStatsGrid";
import PropertyDescription from "@/components/property-detail/PropertyDescription";
import InvestmentHighlights from "@/components/property-detail/InvestmentHighlights";
import PropertyAccordions from "@/components/property-detail/PropertyAccordions";
import ROIBreakdown from "@/components/property-detail/ROIBreakdown";
import ComplianceDocuments from "@/components/property-detail/ComplianceDocuments";
import PropertyCTAs from "@/components/property-detail/PropertyCTAs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error } = useProperty(id || "");

  if (isLoading) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  if (error || !property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/properties">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/properties"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyGallery
              photos={property.photo_urls || []}
              floorPlanUrls={property.floor_plan_urls || []}
              title={property.title}
            />
            
            <PropertyHeader property={property} />
            
            <PropertyQuickSpecs property={property} />
            
            <FinancialStatsGrid property={property} />
            
            <PropertyDescription description={property.property_description} />
            
            <InvestmentHighlights property={property} />
            
            <PropertyAccordions property={property} />
            
            <ROIBreakdown property={property} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PropertyCTAs property={property} />
            <ComplianceDocuments property={property} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
