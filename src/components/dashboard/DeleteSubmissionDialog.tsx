import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserSubmissions, SellerSubmission } from "@/hooks/useUserSubmissions";
import { Loader2 } from "lucide-react";

interface DeleteSubmissionDialogProps {
  submission: SellerSubmission | null;
  onClose: () => void;
}

export function DeleteSubmissionDialog({ submission, onClose }: DeleteSubmissionDialogProps) {
  const { deleteSubmission } = useUserSubmissions();

  const handleDelete = async () => {
    if (!submission) return;
    
    await deleteSubmission.mutateAsync(submission.id);
    onClose();
  };

  return (
    <AlertDialog open={!!submission} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Property Submission</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your submission for{" "}
            <strong>{submission?.property_address}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteSubmission.isPending}
          >
            {deleteSubmission.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
