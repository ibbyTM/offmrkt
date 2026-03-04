import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Compare from "./pages/Compare";
import SubmitProperty from "./pages/SubmitProperty";
import Auth from "./pages/Auth";
import Questionnaire from "./pages/Questionnaire";
import ApplicationStatus from "./pages/ApplicationStatus";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Mortgage from "./pages/Mortgage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import GDPR from "./pages/GDPR";
import NotFound from "./pages/NotFound";
import FunnelRouter from "./pages/funnels/FunnelRouter";
import AdCreatives from "./pages/AdCreatives";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <ComparisonProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/submit-property" element={<SubmitProperty />} />
                <Route path="/login" element={<Auth mode="login" />} />
                <Route path="/register" element={<Auth mode="register" />} />
                <Route path="/questionnaire" element={<Questionnaire />} />
                <Route path="/application-status" element={<ApplicationStatus />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requireQuestionnaire>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/ad-creatives" element={<AdCreatives />} />
                <Route path="/mortgage" element={<Mortgage />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/gdpr" element={<GDPR />} />
                {/* Funnel routes - conversion-focused landing pages */}
                <Route path="/f/:funnelSlug" element={<FunnelRouter />} />
                <Route path="/f/:funnelSlug/:step" element={<FunnelRouter />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ComparisonProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
