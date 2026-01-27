import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFunnel, getDeviceType } from '@/contexts/FunnelContext';

interface TrackEventOptions {
  stepNumber?: number;
  metadata?: Record<string, any>;
}

export function useFunnelTracking() {
  const {
    sessionId,
    funnelId,
    funnelSlug,
    variant,
    utmParams,
    currentStep,
  } = useFunnel();

  const dbSessionIdRef = useRef<string | null>(null);
  const hasCreatedSession = useRef(false);

  // Create or get database session
  const ensureSession = useCallback(async () => {
    if (!sessionId || !funnelSlug) return null;
    if (dbSessionIdRef.current) return dbSessionIdRef.current;
    if (hasCreatedSession.current) return null;

    hasCreatedSession.current = true;

    try {
      // Check if session already exists
      const { data: existingSession } = await (supabase
        .from('funnel_sessions') as any)
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (existingSession) {
        dbSessionIdRef.current = existingSession.id;
        // Update last activity
        await (supabase
          .from('funnel_sessions') as any)
          .update({ last_activity_at: new Date().toISOString() })
          .eq('id', existingSession.id);
        return existingSession.id;
      }

      // Create new session
      const { data: newSession, error } = await (supabase
        .from('funnel_sessions') as any)
        .insert({
          session_id: sessionId,
          funnel_id: funnelId,
          variant,
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_content: utmParams.utm_content,
          utm_term: utmParams.utm_term,
          referrer_url: typeof document !== 'undefined' ? document.referrer : null,
          device_type: getDeviceType(),
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating funnel session:', error);
        hasCreatedSession.current = false;
        return null;
      }

      dbSessionIdRef.current = newSession.id;
      return newSession.id;
    } catch (error) {
      console.error('Error in ensureSession:', error);
      hasCreatedSession.current = false;
      return null;
    }
  }, [sessionId, funnelId, funnelSlug, variant, utmParams]);

  // Track page view on mount
  useEffect(() => {
    if (sessionId && funnelSlug) {
      trackEvent('page_view', { stepNumber: currentStep });
    }
  }, [sessionId, funnelSlug]);

  const trackEvent = useCallback(
    async (eventType: string, options: TrackEventOptions = {}) => {
      const dbSessionId = await ensureSession();
      if (!dbSessionId) return;

      try {
        await (supabase.from('funnel_events') as any).insert({
          session_id: dbSessionId,
          event_type: eventType,
          step_number: options.stepNumber ?? currentStep,
          metadata: options.metadata ?? {},
        });

        // Update session last activity
        await (supabase
          .from('funnel_sessions') as any)
          .update({ last_activity_at: new Date().toISOString() })
          .eq('id', dbSessionId);
      } catch (error) {
        console.error('Error tracking event:', error);
      }
    },
    [ensureSession, currentStep]
  );

  const trackConversion = useCallback(
    async (
      conversionType: string,
      entityId?: string,
      value?: number
    ) => {
      const dbSessionId = await ensureSession();
      if (!dbSessionId) return;

      try {
        const conversionData: Record<string, any> = {
          session_id: dbSessionId,
          funnel_id: funnelId,
          conversion_type: conversionType,
          value,
        };

        // Set the appropriate foreign key based on conversion type
        if (conversionType === 'lead' && entityId) {
          conversionData.lead_id = entityId;
        } else if (conversionType === 'submission' && entityId) {
          conversionData.submission_id = entityId;
        } else if (conversionType === 'registration' && entityId) {
          conversionData.user_id = entityId;
        }

        await (supabase.from('funnel_conversions') as any).insert(conversionData);

      // Also track as event
      await trackEvent('conversion', {
        metadata: { conversion_type: conversionType, entity_id: entityId, conversion_value: value },
      });
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  },
  [ensureSession, funnelId, trackEvent]
);

  const trackStepComplete = useCallback(
    async (stepNumber: number, stepData?: Record<string, any>) => {
      await trackEvent('step_complete', {
        stepNumber,
        metadata: stepData,
      });
    },
    [trackEvent]
  );

  const trackFormSubmit = useCallback(
    async (formData?: Record<string, any>) => {
      await trackEvent('form_submit', {
        metadata: formData,
      });
    },
    [trackEvent]
  );

  const trackExit = useCallback(async () => {
    await trackEvent('exit', { stepNumber: currentStep });
  }, [trackEvent, currentStep]);

  return {
    sessionId,
    utmParams,
    trackEvent,
    trackConversion,
    trackStepComplete,
    trackFormSubmit,
    trackExit,
  };
}
