import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { variant = "default" } = await req.json().catch(() => ({}));

    // Different prompt variations for variety
    const prompts: Record<string, string> = {
      default: `Create a minimalist logo for "Off The Markets" - a premium property investment brand. 
        Design requirements:
        - Abstract letter "M" transformed into a geometric roof/house silhouette
        - Clean, modern, professional aesthetic
        - Color palette: teal (#14B8A6) as primary, navy (#1E3A5A) as accent
        - The "M" should subtly suggest a property/roofline shape
        - Include the wordmark "Off The Markets" in a sophisticated sans-serif font below or beside the icon
        - White/clean background for versatility
        - Vector-style clarity, suitable for both large and small applications
        - Premium, exclusive feel befitting a luxury property marketplace
        Ultra high resolution.`,
      
      icon_only: `Create a standalone icon/symbol for "Off The Markets" property investment brand.
        Design requirements:
        - Abstract "M" letterform that forms a roof/house silhouette
        - Geometric, minimal, memorable shape
        - Teal (#14B8A6) and navy (#1E3A5A) color palette
        - Should work as a favicon and app icon
        - Clean white background
        - Modern, sophisticated, premium aesthetic
        Ultra high resolution.`,
      
      wordmark: `Create a typographic wordmark logo for "Off The Markets" property investment brand.
        Design requirements:
        - "Off The Markets" text in elegant, modern sans-serif typography
        - The "M" in "Markets" subtly incorporates a roof/house shape
        - Teal (#14B8A6) and navy (#1E3A5A) color palette
        - Clean, professional, premium appearance
        - White background
        - Suitable for headers and business materials
        Ultra high resolution.`,
    };

    const prompt = prompts[variant] || prompts.default;

    console.log("Generating logo with variant:", variant);

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (!imageData) {
      throw new Error("No image generated");
    }

    return new Response(
      JSON.stringify({
        image: imageData,
        description: textResponse || "Logo concept generated successfully",
        variant,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating logo:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate logo" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
