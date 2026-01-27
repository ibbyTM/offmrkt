import { useEffect, useState } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';

interface VariantConfig {
  variants: string[];
  weights?: number[];
}

const VARIANT_STORAGE_PREFIX = 'funnel_variant_';

function selectVariant(config: VariantConfig): string {
  const { variants, weights } = config;
  
  if (!weights || weights.length !== variants.length) {
    // Equal distribution
    return variants[Math.floor(Math.random() * variants.length)];
  }

  // Weighted random selection
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < variants.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return variants[i];
    }
  }
  
  return variants[0];
}

export function useFunnelVariant(funnelSlug: string, config?: VariantConfig) {
  const { setVariant } = useFunnel();
  const [variant, setLocalVariant] = useState<string>('v1');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!funnelSlug) {
      setIsLoading(false);
      return;
    }

    // 1. Check URL param for forced variant
    const urlParams = new URLSearchParams(window.location.search);
    const forcedVariant = urlParams.get('variant');
    
    if (forcedVariant) {
      setLocalVariant(forcedVariant);
      setVariant(forcedVariant);
      setIsLoading(false);
      return;
    }

    // 2. Check sessionStorage for existing assignment
    const storageKey = `${VARIANT_STORAGE_PREFIX}${funnelSlug}`;
    const storedVariant = sessionStorage.getItem(storageKey);
    
    if (storedVariant) {
      setLocalVariant(storedVariant);
      setVariant(storedVariant);
      setIsLoading(false);
      return;
    }

    // 3. Randomly assign based on config
    const defaultConfig: VariantConfig = config || { variants: ['v1'] };
    const selectedVariant = selectVariant(defaultConfig);
    
    // Persist to sessionStorage
    sessionStorage.setItem(storageKey, selectedVariant);
    
    setLocalVariant(selectedVariant);
    setVariant(selectedVariant);
    setIsLoading(false);
  }, [funnelSlug, config, setVariant]);

  return { variant, isLoading };
}

// Helper to get variant for specific funnel types
export function useSellerFunnelVariant(funnelSlug: string) {
  return useFunnelVariant(funnelSlug, {
    variants: ['v1', 'v2', 'v3'],
    weights: [50, 30, 20], // 50% v1, 30% v2, 20% v3
  });
}

export function useInvestorFunnelVariant(funnelSlug: string) {
  return useFunnelVariant(funnelSlug, {
    variants: ['v1', 'v2'],
    weights: [60, 40], // 60% v1, 40% v2
  });
}
