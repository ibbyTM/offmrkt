import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

interface AuthPageProps {
  mode: "login" | "register";
}

interface LocationState {
  from?: { pathname: string };
  returnTo?: string;
}

const Auth = ({ mode }: AuthPageProps) => {
  const { user, loading, hasCompletedQuestionnaire } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationState | null;
  const returnTo = locationState?.returnTo;
  const from = locationState?.from?.pathname || "/";

  useEffect(() => {
    if (!loading && user) {
      // If returnTo is specified (e.g., from submit-property), go there directly
      if (returnTo) {
        navigate(returnTo);
      } else if (!hasCompletedQuestionnaire) {
        navigate("/questionnaire");
      } else {
        navigate(from);
      }
    }
  }, [user, loading, hasCompletedQuestionnaire, navigate, returnTo, from]);

  if (loading) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <AuthForm mode={mode} returnTo={returnTo} />
      </div>
    </Layout>
  );
};

export default Auth;
