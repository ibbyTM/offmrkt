import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, Loader2, AlertTriangle } from "lucide-react";

export const PhoneNumberPrompt = () => {
  const { user, hasCompletedQuestionnaire } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user || !hasCompletedQuestionnaire) {
      setOpen(false);
      setChecked(true);
      return;
    }

    const checkPhone = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("phone")
        .eq("user_id", user.id)
        .single();

      if (!data?.phone) {
        setOpen(true);
      }
      setChecked(true);
    };

    checkPhone();
  }, [user, hasCompletedQuestionnaire]);

  if (!checked || !open) return null;

  const handleSave = async () => {
    if (phoneInput.length < 10) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ phone: phoneInput })
        .eq("user_id", user!.id);
      if (error) throw error;
      setOpen(false);
      toast({ title: "Phone saved", description: "Your phone number has been added successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to save phone number. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md" onEscapeKeyDown={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-destructive/10 p-2.5">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl">Phone Number Required</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            We need your phone number to contact you about matching investment opportunities. 
            You won't be able to continue until this is provided.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium">Your phone number</label>
          </div>
          <Input
            placeholder="07123 456789"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            type="tel"
            autoFocus
          />
        </div>
        <AlertDialogFooter>
          <Button
            onClick={handleSave}
            disabled={saving || phoneInput.length < 10}
            className="w-full"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Phone className="h-4 w-4 mr-2" />}
            Save Phone Number
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
