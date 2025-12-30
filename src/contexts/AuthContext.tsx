import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type InvestorStatus = "pending" | "approved" | "rejected" | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  investorStatus: InvestorStatus;
  hasCompletedQuestionnaire: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshInvestorStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [investorStatus, setInvestorStatus] = useState<InvestorStatus>(null);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);

  const fetchInvestorStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from("investor_applications")
      .select("status")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching investor status:", error);
      return;
    }

    if (data) {
      setInvestorStatus(data.status as InvestorStatus);
      setHasCompletedQuestionnaire(true);
    } else {
      setInvestorStatus(null);
      setHasCompletedQuestionnaire(false);
    }
  };

  const refreshInvestorStatus = async () => {
    if (user) {
      await fetchInvestorStatus(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer Supabase calls with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchInvestorStatus(session.user.id);
          }, 0);
        } else {
          setInvestorStatus(null);
          setHasCompletedQuestionnaire(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        fetchInvestorStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setInvestorStatus(null);
    setHasCompletedQuestionnaire(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        investorStatus,
        hasCompletedQuestionnaire,
        signUp,
        signIn,
        signOut,
        refreshInvestorStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
