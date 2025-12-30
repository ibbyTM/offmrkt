import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireApproved?: boolean;
  requireQuestionnaire?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireApproved = false,
  requireQuestionnaire = false,
}: ProtectedRouteProps) => {
  const { user, loading, investorStatus, hasCompletedQuestionnaire } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user hasn't completed questionnaire and we're not on the questionnaire page
  if (requireQuestionnaire && !hasCompletedQuestionnaire && location.pathname !== "/questionnaire") {
    return <Navigate to="/questionnaire" replace />;
  }

  // If route requires approved investor status
  if (requireApproved && investorStatus !== "approved") {
    if (!hasCompletedQuestionnaire) {
      return <Navigate to="/questionnaire" replace />;
    }
    return <Navigate to="/application-status" replace />;
  }

  return <>{children}</>;
};
