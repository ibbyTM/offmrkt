import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, MailX } from "lucide-react";
import Layout from "@/components/layout/Layout";

type Status = "loading" | "valid" | "already_unsubscribed" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();

        if (res.ok && data.valid === true) {
          setStatus("valid");
        } else if (data.reason === "already_unsubscribed") {
          setStatus("already_unsubscribed");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };

    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });

      if (error) throw error;

      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already_unsubscribed");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            {status === "loading" && (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Validating your request…</p>
              </>
            )}

            {status === "valid" && (
              <>
                <MailX className="h-10 w-10 text-muted-foreground mx-auto" />
                <h1 className="text-xl font-bold">Unsubscribe from Emails</h1>
                <p className="text-muted-foreground text-sm">
                  Are you sure you want to unsubscribe from Off The Markets email notifications?
                  You will no longer receive property alerts or application updates.
                </p>
                <Button
                  onClick={handleUnsubscribe}
                  disabled={isProcessing}
                  variant="destructive"
                  className="min-h-[44px]"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Confirm Unsubscribe
                </Button>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-10 w-10 text-green-600 mx-auto" />
                <h1 className="text-xl font-bold">You've Been Unsubscribed</h1>
                <p className="text-muted-foreground text-sm">
                  You will no longer receive email notifications from Off The Markets.
                  If you change your mind, you can contact us at any time.
                </p>
              </>
            )}

            {status === "already_unsubscribed" && (
              <>
                <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto" />
                <h1 className="text-xl font-bold">Already Unsubscribed</h1>
                <p className="text-muted-foreground text-sm">
                  You've already unsubscribed from our emails. No further action is needed.
                </p>
              </>
            )}

            {status === "invalid" && (
              <>
                <XCircle className="h-10 w-10 text-destructive mx-auto" />
                <h1 className="text-xl font-bold">Invalid Link</h1>
                <p className="text-muted-foreground text-sm">
                  This unsubscribe link is invalid or has expired.
                  If you'd like to unsubscribe, please use the link from your most recent email.
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-10 w-10 text-destructive mx-auto" />
                <h1 className="text-xl font-bold">Something Went Wrong</h1>
                <p className="text-muted-foreground text-sm">
                  We couldn't process your request. Please try again later or contact us for help.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Unsubscribe;
