import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { udprn } = await req.json();
    
    if (!udprn) {
      return new Response(
        JSON.stringify({ error: 'UDPRN required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('IDEAL_POSTCODES_API_KEY');
    if (!apiKey) {
      console.error('IDEAL_POSTCODES_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Address lookup service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Resolve UDPRN to full address details
    const url = `https://api.ideal-postcodes.co.uk/v1/udprn/${udprn}?api_key=${apiKey}`;
    
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const data = await response.json();

    if (!response.ok || !data.result) {
      console.error('Ideal Postcodes resolve error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to resolve address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = data.result;
    
    // Build full street address from components
    const addressParts = [
      result.line_1,
      result.line_2,
      result.line_3,
    ].filter(Boolean);

    const address = {
      street: addressParts.join(', '),
      city: result.post_town || result.town_or_city || '',
      postcode: result.postcode || '',
      county: result.county || '',
      country: result.country || 'England',
    };

    return new Response(
      JSON.stringify({ address }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Address resolve error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to resolve address' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
