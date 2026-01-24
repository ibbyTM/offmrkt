import { Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { QuestionnaireForm } from "@/components/questionnaire/QuestionnaireForm";
import { useAuth } from "@/contexts/AuthContext";

const Questionnaire = () => {
  const { hasCompletedQuestionnaire, loading } = useAuth();

  // Redirect to dashboard if questionnaire is already completed
  if (!loading && hasCompletedQuestionnaire) {
    return <Navigate to="/dashboard" replace />;
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
