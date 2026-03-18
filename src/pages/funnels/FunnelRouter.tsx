import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FunnelProvider, useFunnel } from '@/contexts/FunnelContext';
import { useFunnelVariant } from '@/hooks/useFunnelVariant';

// Import funnel pages
import SellFunnelV1 from './sell/SellFunnelV1';
import InvestFunnelV1 from './invest/InvestFunnelV1';

interface FunnelConfig {
  id: string;
  slug: string;
  name: string;
  type: 'seller' | 'investor' | 'onboard';
  variant: string;
  config: Record<string, any>;
}

// Funnel registry - maps slugs to components
const FUNNEL_REGISTRY: Record<string, Record<string, React.ComponentType<{ config?: FunnelConfig }>>> = {
  // Seller funnels
  'quick-cash': {
    v1: SellFunnelV1,
    v2: SellFunnelV1, // Will create V2 later
    v3: SellFunnelV1, // Will create V3 later
  },
  'free-valuation': {
    v1: SellFunnelV1,
    v2: SellFunnelV1,
  },
  'landlord-exit': {
    v1: SellFunnelV1,
    v2: SellFunnelV1,
  },
  // Investor funnels
  'off-market-deals': {
    v1: InvestFunnelV1,
    v2: InvestFunnelV1,
  },
  'high-yield': {
    v1: InvestFunnelV1,
    v2: InvestFunnelV1,
  },
  // Default/fallback
  sell: {
    v1: SellFunnelV1,
  },
  invest: {
    v1: InvestFunnelV1,
  },
};

function FunnelContent() {
  const { funnelSlug } = useParams<{ funnelSlug: string; step?: string }>();
  const [searchParams] = useSearchParams();
  const [funnelConfig, setFunnelConfig] = useState<FunnelConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setFunnelSlug, setFunnelId, setVariant } = useFunnel();
  const { variant: selectedVariant } = useFunnelVariant(funnelSlug || '');

  // Check for subdomain override
  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Check if we're on a subdomain (e.g., sell.offmrkt.com)
    if (parts.length >= 3) {
      const subdomain = parts[0];
      if (subdomain === 'sell' && !funnelSlug) {
        // Redirect to default seller funnel
        window.location.href = '/f/quick-cash';
      } else if ((subdomain === 'buy' || subdomain === 'invest') && !funnelSlug) {
        // Redirect to default investor funnel
        window.location.href = '/f/off-market-deals';
      }
    }
  }, [funnelSlug]);

  // Load funnel config from database
  useEffect(() => {
    async function loadFunnelConfig() {
      if (!funnelSlug) {
        setError('No funnel specified');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await (supabase
          .from('funnel_definitions') as any)
          .select('*')
          .eq('slug', funnelSlug)
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (data) {
          setFunnelConfig({
            id: data.id,
            slug: data.slug,
            name: data.name,
            type: data.type as 'seller' | 'investor' | 'onboard',
            variant: data.variant,
            config: data.config as Record<string, any>,
          });
          setFunnelSlug(data.slug);
          setFunnelId(data.id);
        } else {
          // Use default config if not in database
          setFunnelConfig({
            id: '',
            slug: funnelSlug,
            name: funnelSlug,
            type: 'seller',
            variant: 'v1',
            config: {},
          });
          setFunnelSlug(funnelSlug);
        }
      } catch (err) {
        console.error('Error loading funnel config:', err);
        // Use default config on error
        setFunnelConfig({
          id: '',
          slug: funnelSlug,
          name: funnelSlug,
          type: 'seller',
          variant: 'v1',
          config: {},
        });
        setFunnelSlug(funnelSlug);
      } finally {
        setIsLoading(false);
      }
    }

    loadFunnelConfig();
  }, [funnelSlug, setFunnelSlug, setFunnelId]);

  // Update variant when it changes
  useEffect(() => {
    if (selectedVariant) {
      setVariant(selectedVariant);
    }
  }, [selectedVariant, setVariant]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !funnelConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Funnel Not Found</h1>
          <p className="text-muted-foreground">
            The requested funnel could not be found.
          </p>
        </div>
      </div>
    );
  }

  // Get the appropriate component
  const slug = funnelConfig.slug;
  const variant = selectedVariant || funnelConfig.variant || 'v1';

  const funnelComponents = FUNNEL_REGISTRY[slug] || FUNNEL_REGISTRY.sell;
  const FunnelComponent = funnelComponents[variant] || funnelComponents.v1 || SellFunnelV1;

  return <FunnelComponent config={funnelConfig} />;
}

export default function FunnelRouter() {
  return (
    <FunnelProvider>
      <FunnelContent />
    </FunnelProvider>
  );
}
