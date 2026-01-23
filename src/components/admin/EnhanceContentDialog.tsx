import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, X, Sparkles, Edit2 } from "lucide-react";
import type { EnhancedContent } from "@/hooks/useEnhancePropertyContent";

interface EnhanceContentDialogProps {
  open: boolean;
  onClose: () => void;
  originalContent: {
    title: string;
    description: string;
  };
  enhancedContent: EnhancedContent;
  onApply: (content: EnhancedContent) => void;
  isApplying?: boolean;
}

export const EnhanceContentDialog = ({
  open,
  onClose,
  originalContent,
  enhancedContent,
  onApply,
  isApplying = false,
}: EnhanceContentDialogProps) => {
  const [editedContent, setEditedContent] = useState<EnhancedContent>(enhancedContent);
  const [isEditing, setIsEditing] = useState(false);

  const handleApply = () => {
    onApply(editedContent);
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...editedContent.highlights];
    newHighlights[index] = value;
    setEditedContent({ ...editedContent, highlights: newHighlights });
  };

  const addHighlight = () => {
    if (editedContent.highlights.length < 5) {
      setEditedContent({
        ...editedContent,
        highlights: [...editedContent.highlights, ""],
      });
    }
  };

  const removeHighlight = (index: number) => {
    const newHighlights = editedContent.highlights.filter((_, i) => i !== index);
    setEditedContent({ ...editedContent, highlights: newHighlights });
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle>AI-Enhanced Content</DialogTitle>
          </div>
          <DialogDescription>
            Review and edit the AI-generated content before applying
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title Comparison */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Title</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="h-7 text-xs"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                {isEditing ? "Done Editing" : "Edit"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs">Original</Badge>
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                  {originalContent.title || "No title"}
                </p>
              </div>
              <div className="space-y-1">
                <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                  Enhanced
                </Badge>
                {isEditing ? (
                  <Input
                    value={editedContent.title}
                    onChange={(e) =>
                      setEditedContent({ ...editedContent, title: e.target.value })
                    }
                    className="text-sm"
                    maxLength={60}
                  />
                ) : (
                  <p className="text-sm bg-primary/5 rounded-md p-3 border border-primary/20">
                    {editedContent.title}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {editedContent.title.length}/60 characters
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description Comparison */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Description</Label>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs">Original</Badge>
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3 min-h-[120px]">
                  {originalContent.description || "No description"}
                </p>
              </div>
              <div className="space-y-1">
                <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                  Enhanced
                </Badge>
                {isEditing ? (
                  <Textarea
                    value={editedContent.description}
                    onChange={(e) =>
                      setEditedContent({ ...editedContent, description: e.target.value })
                    }
                    className="text-sm min-h-[120px]"
                    rows={5}
                  />
                ) : (
                  <p className="text-sm bg-primary/5 rounded-md p-3 min-h-[120px] border border-primary/20">
                    {editedContent.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Investment Highlights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Investment Highlights</Label>
              {isEditing && editedContent.highlights.length < 5 && (
                <Button variant="outline" size="sm" onClick={addHighlight} className="h-7 text-xs">
                  Add Highlight
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {editedContent.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="secondary" className="shrink-0">
                    {index + 1}
                  </Badge>
                  {isEditing ? (
                    <>
                      <Input
                        value={highlight}
                        onChange={(e) => handleHighlightChange(index, e.target.value)}
                        className="text-sm flex-1"
                        placeholder="Enter highlight..."
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeHighlight(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm bg-primary/5 rounded-md px-3 py-2 flex-1 border border-primary/20">
                      {highlight}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isApplying}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isApplying}>
            <Check className="h-4 w-4 mr-2" />
            {isApplying ? "Applying..." : "Apply Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
