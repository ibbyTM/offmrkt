import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PropertyData {
  title: string;
  asking_price: number;
  gross_yield_percentage: number | null;
  roce_percentage: number | null;
  market_discount_percentage: number | null;
  is_tenanted: boolean | null;
  epc_rating: string | null;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  property_city: string;
  strategies: string[] | null;
  current_rental_income: number | null;
  estimated_rental_income: number | null;
  deposit_required: number | null;
  tenure: string | null;
  refurb_cost: number | null;
  end_value_gdv: number | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - Please log in to use AI analysis" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("JWT verification failed:", claimsError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Authenticated request from user: ${userId}`);

    const { property } = await req.json() as { property: PropertyData };
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const rentalIncome = property.current_rental_income || property.estimated_rental_income || 0;
    const strategies = property.strategies?.join(", ") || "Not specified";

    const prompt = `You are a UK property investment analyst. Analyze this investment property and provide a structured assessment.

Property Data:
- Title: ${property.title}
- Price: £${property.asking_price?.toLocaleString()}
- Location: ${property.property_city}
- Type: ${property.property_type?.replace("_", " ")}
- Bedrooms: ${property.bedrooms || "Not specified"}
- Bathrooms: ${property.bathrooms || "Not specified"}
- Gross Yield: ${property.gross_yield_percentage ? (property.gross_yield_percentage / 100).toFixed(1) + "%" : "Not specified"}
- ROCE: ${property.roce_percentage ? (property.roce_percentage / 100).toFixed(1) + "%" : "Not specified"}
- Market Discount: ${property.market_discount_percentage ? property.market_discount_percentage + "%" : "Not specified"}
- Tenanted: ${property.is_tenanted ? "Yes" : "No"}
- EPC Rating: ${property.epc_rating || "Not specified"}
- Monthly Rental Income: £${rentalIncome?.toLocaleString()}
- Deposit Required: £${property.deposit_required?.toLocaleString() || "Not specified"}
- Tenure: ${property.tenure || "Not specified"}
- Investment Strategies: ${strategies}
- Refurbishment Cost: ${property.refurb_cost ? "£" + property.refurb_cost.toLocaleString() : "None required"}
- End Value (GDV): ${property.end_value_gdv ? "£" + property.end_value_gdv.toLocaleString() : "Not applicable"}

Provide your analysis as a JSON object with this exact structure:
{
  "summary": "2-3 sentence executive summary of this investment opportunity",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "considerations": ["consideration 1", "consideration 2"],
  "idealInvestor": "1-2 sentence description of who this property suits best",
  "strategyScores": {
    "btl": 0-100 score for Buy-to-Let suitability,
    "brrr": 0-100 score for BRRR strategy,
    "hmo": 0-100 score for HMO conversion potential,
    "flip": 0-100 score for quick flip/refurb potential
  }
}

Base your analysis on the actual data provided. Be specific and insightful. Return ONLY valid JSON, no markdown or explanations.`;

    console.log(`Calling Lovable AI for property analysis (user: ${userId})...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(30000),
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limited by AI gateway");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("AI credits exhausted");
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    console.log("AI response received, parsing...");

    // Clean the response - remove markdown code blocks if present
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.slice(7);
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    const analysis = JSON.parse(cleanedContent);
    
    console.log(`Analysis parsed successfully for user: ${userId}`);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in analyze-property:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
