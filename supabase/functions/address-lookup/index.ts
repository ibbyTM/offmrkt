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
    const { query } = await req.json();
    
    if (!query || query.length < 3) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    // Call Ideal Postcodes Autocomplete API
    const url = `https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses?api_key=${apiKey}&query=${encodeURIComponent(query)}&limit=6`;
    
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const data = await response.json();

    if (!response.ok) {
      console.error('Ideal Postcodes API error:', data);
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format the suggestions
    const suggestions = (data.result?.hits || []).map((hit: any) => ({
      id: hit.id,
      address: hit.suggestion,
      udprn: hit.udprn,
    }));

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Address lookup error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to lookup address' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
