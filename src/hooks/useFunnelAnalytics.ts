import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type FunnelDefinition = Tables<'funnel_definitions'>;
type FunnelSession = Tables<'funnel_sessions'>;
type FunnelEvent = Tables<'funnel_events'>;
type FunnelConversion = Tables<'funnel_conversions'> & {
  funnel_definitions?: { name: string; slug: string } | null;
};

interface FunnelData {
  id: string;
  slug: string;
  name: string;
  type: string;
  variant: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
}

interface TrafficSource {
  source: string;
  sessions: number;
}

interface StepDropoff {
  step: number;
  stepName: string;
  visitors: number;
  percentage: number;
}

interface DeviceBreakdown {
  type: string;
  sessions: number;
  percentage: number;
}

interface RecentConversion {
  id: string;
  funnelName: string;
  funnelSlug: string;
  conversionType: string;
  createdAt: string;
}

export interface FunnelAnalytics {
  totalSessions: number;
  totalConversions: number;
  conversionRate: number;
  avgStepsCompleted: number;
  funnels: FunnelData[];
  trafficSources: TrafficSource[];
  stepDropoff: StepDropoff[];
  devices: DeviceBreakdown[];
  recentConversions: RecentConversion[];
  isLoading: boolean;
  error: Error | null;
}

export function useFunnelAnalytics() {
  return useQuery({
    queryKey: ['funnel-analytics'],
    queryFn: async (): Promise<Omit<FunnelAnalytics, 'isLoading' | 'error'>> => {
      // Fetch all data in parallel
      const [funnelsResult, sessionsResult, eventsResult, conversionsResult] = await Promise.all([
        supabase.from('funnel_definitions').select('*').eq('is_active', true),
        supabase.from('funnel_sessions').select('*'),
        supabase.from('funnel_events').select('*'),
        supabase
          .from('funnel_conversions')
          .select('*, funnel_definitions(name, slug)')
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      // Propagate any query errors immediately
      if (funnelsResult.error) throw funnelsResult.error;
      if (sessionsResult.error) throw sessionsResult.error;
      if (eventsResult.error) throw eventsResult.error;
      if (conversionsResult.error) throw conversionsResult.error;

      const funnelDefs: FunnelDefinition[] = funnelsResult.data ?? [];
      const sessions: FunnelSession[] = sessionsResult.data ?? [];
      const events: FunnelEvent[] = eventsResult.data ?? [];
      const conversions: FunnelConversion[] = (conversionsResult.data ?? []) as FunnelConversion[];

      // Calculate total sessions and conversions
      const totalSessions = sessions.length;
      const totalConversions = conversions.length;
      const conversionRate = totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0;

      // Calculate average steps completed
      const stepEvents = events.filter((e) => e.event_type === 'step_complete');
      const avgStepsCompleted = stepEvents.length > 0
        ? stepEvents.reduce((sum, e) => sum + (e.step_number ?? 1), 0) / stepEvents.length
        : 0;

      // Aggregate per-funnel data
      const funnelMap = new Map<string, FunnelData>();

      funnelDefs.forEach((f) => {
        funnelMap.set(f.id, {
          id: f.id,
          slug: f.slug,
          name: f.name,
          type: f.type,
          variant: f.variant,
          sessions: 0,
          conversions: 0,
          conversionRate: 0,
        });
      });

      // Count sessions per funnel
      sessions.forEach((s) => {
        if (s.funnel_id && funnelMap.has(s.funnel_id)) {
          funnelMap.get(s.funnel_id)!.sessions++;
        }
      });

      // Count conversions per funnel
      conversions.forEach((c) => {
        if (c.funnel_id && funnelMap.has(c.funnel_id)) {
          funnelMap.get(c.funnel_id)!.conversions++;
        }
      });

      // Calculate conversion rates
      funnelMap.forEach((funnel) => {
        funnel.conversionRate = funnel.sessions > 0
          ? (funnel.conversions / funnel.sessions) * 100
          : 0;
      });

      // Traffic sources aggregation
      const sourceMap = new Map<string, number>();
      sessions.forEach((s) => {
        const source = s.utm_source ?? 'Direct';
        sourceMap.set(source, (sourceMap.get(source) ?? 0) + 1);
      });

      const trafficSources: TrafficSource[] = Array.from(sourceMap.entries())
        .map(([source, count]) => ({ source, sessions: count }))
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 6);

      // Step drop-off analysis
      const stepNames = ['Landing', 'Property Type', 'Details', 'Contact', 'Confirmation'];
      const stepCounts = new Map<number, number>();

      // Count page views as step 1
      const pageViews = events.filter((e) => e.event_type === 'page_view').length;
      stepCounts.set(1, Math.max(pageViews, totalSessions));

      // Count step completions
      stepEvents.forEach((e) => {
        const step = e.step_number ?? 1;
        stepCounts.set(step + 1, (stepCounts.get(step + 1) ?? 0) + 1);
      });

      const step1Count = stepCounts.get(1) ?? 1;
      const stepDropoff: StepDropoff[] = [1, 2, 3, 4].map((step) => ({
        step,
        stepName: stepNames[step - 1] ?? `Step ${step}`,
        visitors: stepCounts.get(step) ?? 0,
        percentage: step1Count > 0 ? ((stepCounts.get(step) ?? 0) / step1Count) * 100 : 0,
      }));

      // Device breakdown
      const deviceMap = new Map<string, number>();
      sessions.forEach((s) => {
        const device = s.device_type ?? 'unknown';
        deviceMap.set(device, (deviceMap.get(device) ?? 0) + 1);
      });

      const devices: DeviceBreakdown[] = Array.from(deviceMap.entries())
        .map(([type, count]) => ({
          type,
          sessions: count,
          percentage: totalSessions > 0 ? (count / totalSessions) * 100 : 0,
        }))
        .sort((a, b) => b.sessions - a.sessions);

      // Recent conversions
      const recentConversions: RecentConversion[] = conversions.map((c) => ({
        id: c.id,
        funnelName: c.funnel_definitions?.name ?? 'Unknown',
        funnelSlug: c.funnel_definitions?.slug ?? '',
        conversionType: c.conversion_type,
        createdAt: c.created_at,
      }));

      return {
        totalSessions,
        totalConversions,
        conversionRate,
        avgStepsCompleted,
        funnels: Array.from(funnelMap.values()),
        trafficSources,
        stepDropoff,
        devices,
        recentConversions,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
