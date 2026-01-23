import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PropertyData {
  property_address: string;
  property_city: string;
  property_postcode?: string;
  property_type: string;
  property_description?: string;
  asking_price: number;
  bedrooms?: number;
  bathrooms?: number;
  current_status?: string;
  current_monthly_rent?: number;
  estimated_monthly_rent?: number;
  epc_rating?: string;
  investment_strategies?: string[];
}

interface EnhancedContent {
  title: string;
  description: string;
  highlights: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const propertyData: PropertyData = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Format property type for display
    const propertyTypeFormatted = propertyData.property_type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    // Calculate yield if possible
    let yieldInfo = "";
    const monthlyRent = propertyData.current_monthly_rent || propertyData.estimated_monthly_rent;
    if (monthlyRent && propertyData.asking_price) {
      const grossYield = ((monthlyRent * 12) / propertyData.asking_price) * 100;
      yieldInfo = `Gross Yield: ${grossYield.toFixed(1)}%`;
    }

    const systemPrompt = `You are a UK property investment copywriter specialising in buy-to-let and investment properties. Your task is to create professional, compelling marketing content that appeals to property investors.

Rules:
- Title: Maximum 60 characters. Include the key selling point and location. Make it attention-grabbing.
- Description: 100-150 words. Focus on investment potential, rental yield, location benefits, and property features. Use professional UK English. Structure it well with clear benefits.
- Highlights: 3-5 concise bullet points about investment potential. Each should be impactful and factual.

Tone: Professional, trustworthy, investment-focused. Avoid hyperbole but be compelling.`;

    const propertyPrompt = `Create professional listing content for this investment property:

Property Details:
- Address: ${propertyData.property_address}
- City: ${propertyData.property_city}
- Postcode: ${propertyData.property_postcode || "N/A"}
- Type: ${propertyTypeFormatted}
- Bedrooms: ${propertyData.bedrooms || "N/A"}
- Bathrooms: ${propertyData.bathrooms || "N/A"}
- Asking Price: £${propertyData.asking_price.toLocaleString()}
- Current Status: ${propertyData.current_status?.replace(/_/g, " ") || "N/A"}
- Monthly Rent: £${monthlyRent?.toLocaleString() || "N/A"}
${yieldInfo ? `- ${yieldInfo}` : ""}
- EPC Rating: ${propertyData.epc_rating || "N/A"}
${propertyData.investment_strategies?.length ? `- Investment Strategies: ${propertyData.investment_strategies.join(", ")}` : ""}

Current Description:
${propertyData.property_description || "No description provided"}

Generate an enhanced title, description, and investment highlights for this property.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: propertyPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "enhance_property_content",
              description: "Generate professional property listing content with title, description, and highlights",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Professional property title, max 60 characters",
                  },
                  description: {
                    type: "string",
                    description: "Compelling property description, 100-150 words",
                  },
                  highlights: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 investment highlight bullet points",
                  },
                },
                required: ["title", "description", "highlights"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "enhance_property_content" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    
    // Extract the tool call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "enhance_property_content") {
      throw new Error("Unexpected AI response format");
    }

    const enhancedContent: EnhancedContent = JSON.parse(toolCall.function.arguments);

    // Validate the response
    if (!enhancedContent.title || !enhancedContent.description || !enhancedContent.highlights) {
      throw new Error("Invalid enhanced content structure");
    }

    return new Response(JSON.stringify(enhancedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error enhancing property content:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
