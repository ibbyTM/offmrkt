import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { QuestionnaireForm } from "@/components/questionnaire/QuestionnaireForm";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Questionnaire = () => {
  const { user, loading, hasCompletedQuestionnaire } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/register");
      } else if (hasCompletedQuestionnaire) {
        navigate("/dashboard");
      }
    }
  }, [user, loading, hasCompletedQuestionnaire, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || hasCompletedQuestionnaire) {
    return null;
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Investor Questionnaire</h1>
          <p className="text-muted-foreground">
            Complete this questionnaire to access our exclusive property deals
          </p>
        </div>
        <QuestionnaireForm />
      </div>
    </Layout>
  );
};

export default Questionnaire;
