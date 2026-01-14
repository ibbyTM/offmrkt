import { Link } from "react-router-dom";
import { useUserSubmissions, SellerSubmission } from "@/hooks/useUserSubmissions";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Building2, Pencil, Trash2, Home, MapPin, Bed, Bath, PoundSterling } from "lucide-react";
import { useState } from "react";
import { EditSubmissionDialog } from "./EditSubmissionDialog";
import { DeleteSubmissionDialog } from "./DeleteSubmissionDialog";

const statusConfig = {
  pending: { label: "Pending Review", variant: "secondary" as const },
  reviewing: { label: "Under Review", variant: "outline" as const },
  approved: { label: "Approved", variant: "default" as const },
  rejected: { label: "Rejected", variant: "destructive" as const },
  listed: { label: "Listed", variant: "default" as const },
};

const propertyTypeLabels: Record<string, string> = {
  terraced: "Terraced",
  semi_detached: "Semi-Detached",
  detached: "Detached",
  flat: "Flat",
  bungalow: "Bungalow",
  commercial: "Commercial",
  land: "Land",
  hmo: "HMO",
  other: "Other",
};

export function MyListingsTab() {
  const { submissions, isLoading } = useUserSubmissions();
  const [editSubmission, setEditSubmission] = useState<SellerSubmission | null>(null);
  const [deleteSubmission, setDeleteSubmission] = useState<SellerSubmission | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-2">No property submissions yet</CardTitle>
          <CardDescription className="text-center mb-4">
            Submit a property to sell and track its status here
          </CardDescription>
          <Button asChild>
            <Link to="/submit-property">
              <Home className="mr-2 h-4 w-4" />
              Submit Property
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {submissions.map((submission) => {
          const status = statusConfig[submission.admin_status] || statusConfig.pending;
          const canEdit = submission.admin_status === "pending";

          return (
            <Card key={submission.id} className="overflow-hidden">
              {/* Image */}
              <div className="relative aspect-video bg-muted">
                {submission.photo_urls && submission.photo_urls.length > 0 ? (
                  <img
                    src={submission.photo_urls[0]}
                    alt={submission.property_address}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Badge className="absolute top-2 right-2" variant={status.variant}>
                  {status.label}
                </Badge>
              </div>

              <CardContent className="p-4 space-y-3">
                {/* Address */}
                <div>
                  <h3 className="font-semibold line-clamp-1">{submission.property_address}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {submission.property_city}, {submission.property_postcode}
                  </p>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {submission.bedrooms || "-"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {submission.bathrooms || "-"}
                  </span>
                  <span className="capitalize">
                    {propertyTypeLabels[submission.property_type] || submission.property_type}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-1 text-lg font-bold text-primary">
                  <PoundSterling className="h-4 w-4" />
                  {submission.asking_price.toLocaleString()}
                </div>

                {/* Actions */}
                {canEdit && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditSubmission(submission)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteSubmission(submission)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Admin notes if rejected */}
                {submission.admin_status === "rejected" && submission.admin_notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-destructive">
                      <strong>Reason:</strong> {submission.admin_notes}
                    </p>
                  </div>
                )}

                {/* Submitted date */}
                <p className="text-xs text-muted-foreground">
                  Submitted {new Date(submission.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <EditSubmissionDialog
        submission={editSubmission}
        onClose={() => setEditSubmission(null)}
      />

      {/* Delete Dialog */}
      <DeleteSubmissionDialog
        submission={deleteSubmission}
        onClose={() => setDeleteSubmission(null)}
      />
    </>
  );
}
