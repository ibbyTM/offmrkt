import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, TrendingUp, Users } from "lucide-react";

interface AuthPageProps {
  mode: "login" | "register";
}

interface LocationState {
  from?: { pathname: string };
  returnTo?: string;
}

const stats = [
  { icon: Building2, value: "500+", label: "Off-market properties sourced" },
  { icon: TrendingUp, value: "8.5%", label: "Average gross yield" },
  { icon: Users, value: "£50M+", label: "Total invested by our network" },
];

const Auth = ({ mode }: AuthPageProps) => {
  const { user, loading, hasCompletedQuestionnaire } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationState | null;
  const returnTo = locationState?.returnTo;
  const from = locationState?.from?.pathname || "/";

  useEffect(() => {
    if (!loading && user) {
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
    <div className="grid lg:grid-cols-2 min-h-screen w-full">
      {/* Left — Branded panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[hsl(220,40%,13%)] text-white p-12 relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <img
              src="/assets/offthemarkets-logo.png"
              alt="Off The Markets"
              className="h-8 bg-white rounded-lg px-2 py-1"
            />
          </div>

          <h2 className="font-display text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Off-market deals,
            <br />
            <span className="text-primary">before anyone else.</span>
          </h2>
          <p className="text-white/60 text-lg max-w-md">
            Join our vetted investor network and get exclusive access to
            high-yield UK property deals that never hit the open market.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img
              src="/assets/offthemarkets-logo.png"
              alt="Off The Markets"
              className="h-8 bg-white rounded-lg px-2 py-1"
            />
          </div>
          <AuthForm mode={mode} returnTo={returnTo} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
