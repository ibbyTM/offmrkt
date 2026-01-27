import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

interface FunnelState {
  funnelSlug: string | null;
  funnelId: string | null;
  variant: string;
  currentStep: number;
  totalSteps: number;
  sessionId: string | null;
  utmParams: UTMParams;
  formData: Record<string, any>;
  isLoading: boolean;
}

interface FunnelContextType extends FunnelState {
  setFunnelSlug: (slug: string) => void;
  setFunnelId: (id: string) => void;
  setVariant: (variant: string) => void;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (steps: number) => void;
  setSessionId: (id: string) => void;
  updateFormData: (data: Record<string, any>) => void;
  resetFunnel: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const defaultUtmParams: UTMParams = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
};

const defaultState: FunnelState = {
  funnelSlug: null,
  funnelId: null,
  variant: 'v1',
  currentStep: 1,
  totalSteps: 4,
  sessionId: null,
  utmParams: defaultUtmParams,
  formData: {},
  isLoading: true,
};

const FunnelContext = createContext<FunnelContextType | undefined>(undefined);

const FUNNEL_STORAGE_KEY = 'funnel_state';
const SESSION_ID_KEY = 'funnel_session_id';

function generateSessionId(): string {
  return `fs_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function parseUTMParams(): UTMParams {
  if (typeof window === 'undefined') return defaultUtmParams;
  
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term'),
  };
}

function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FunnelState>(defaultState);

  // Initialize on mount
  useEffect(() => {
    // Get or create session ID
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }

    // Parse UTM params
    const utmParams = parseUTMParams();

    // Restore form data if exists
    const savedState = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
    let formData = {};
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        formData = parsed.formData || {};
      } catch (e) {
        // Ignore parse errors
      }
    }

    setState(prev => ({
      ...prev,
      sessionId,
      utmParams,
      formData,
      isLoading: false,
    }));
  }, []);

  // Persist form data changes
  useEffect(() => {
    if (state.formData && Object.keys(state.formData).length > 0) {
      sessionStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify({ formData: state.formData }));
    }
  }, [state.formData]);

  const setFunnelSlug = (slug: string) => setState(prev => ({ ...prev, funnelSlug: slug }));
  const setFunnelId = (id: string) => setState(prev => ({ ...prev, funnelId: id }));
  const setVariant = (variant: string) => setState(prev => ({ ...prev, variant }));
  const setCurrentStep = (step: number) => setState(prev => ({ ...prev, currentStep: step }));
  const setTotalSteps = (steps: number) => setState(prev => ({ ...prev, totalSteps: steps }));
  const setSessionId = (id: string) => setState(prev => ({ ...prev, sessionId: id }));
  
  const updateFormData = (data: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data },
    }));
  };

  const resetFunnel = () => {
    sessionStorage.removeItem(FUNNEL_STORAGE_KEY);
    setState({
      ...defaultState,
      sessionId: state.sessionId,
      utmParams: state.utmParams,
      isLoading: false,
    });
  };

  const nextStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps),
    }));
  };

  const prevStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  };

  return (
    <FunnelContext.Provider
      value={{
        ...state,
        setFunnelSlug,
        setFunnelId,
        setVariant,
        setCurrentStep,
        setTotalSteps,
        setSessionId,
        updateFormData,
        resetFunnel,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel() {
  const context = useContext(FunnelContext);
  if (context === undefined) {
    throw new Error('useFunnel must be used within a FunnelProvider');
  }
  return context;
}

export { getDeviceType, parseUTMParams };
