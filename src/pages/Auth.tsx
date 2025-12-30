import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

interface AuthPageProps {
  mode: "login" | "register";
}

const Auth = ({ mode }: AuthPageProps) => {
  const { user, loading, hasCompletedQuestionnaire } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  useEffect(() => {
    if (!loading && user) {
      if (!hasCompletedQuestionnaire) {
        navigate("/questionnaire");
      } else {
        navigate(from);
      }
    }
  }, [user, loading, hasCompletedQuestionnaire, navigate, from]);

  if (loading) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <AuthForm mode={mode} />
      </div>
    </Layout>
  );
};

export default Auth;
