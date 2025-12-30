import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, Home, Loader2 } from "lucide-react";

const ApplicationStatus = () => {
  const { user, loading, investorStatus, hasCompletedQuestionnaire } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (!hasCompletedQuestionnaire) {
        navigate("/questionnaire");
      } else if (investorStatus === "approved") {
        navigate("/dashboard");
      }
    }
  }, [user, loading, hasCompletedQuestionnaire, investorStatus, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      title: "Application Under Review",
      description: "Thank you for completing your investor questionnaire. Our team is reviewing your application.",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    rejected: {
      icon: XCircle,
      title: "Application Not Approved",
      description: "Unfortunately, your application does not meet our current criteria. Please contact us if you believe this is an error.",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    approved: {
      icon: CheckCircle,
      title: "Application Approved",
      description: "Congratulations! Your application has been approved. You now have access to our exclusive property deals.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  };

  const status = investorStatus || "pending";
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Layout>
      <div className="container max-w-2xl py-16">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className={`mx-auto w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mb-4`}>
              <Icon className={`h-10 w-10 ${config.color}`} />
            </div>
            <CardTitle className="text-2xl">{config.title}</CardTitle>
            <CardDescription className="text-base">{config.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === "pending" && (
              <div className="bg-muted/50 rounded-lg p-6 text-left space-y-4">
                <h3 className="font-semibold">What happens next?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">1.</span>
                    <span>Our team will review your application within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">2.</span>
                    <span>You'll receive an email notification once approved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">3.</span>
                    <span>Once approved, you'll have full access to our property deals and can save favorites</span>
                  </li>
                </ul>
              </div>
            )}

            {status === "approved" && (
              <Button asChild size="lg">
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            )}

            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ApplicationStatus;
