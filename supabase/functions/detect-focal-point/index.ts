import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { propertyId } = await req.json();
    if (!propertyId) throw new Error("propertyId is required");

    // Fetch property
    const { data: property, error: fetchError } = await supabase
      .from("properties")
      .select("photo_urls")
      .eq("id", propertyId)
      .single();

    if (fetchError || !property) throw new Error("Property not found");

    const imageUrl = property.photo_urls?.[0];
    if (!imageUrl) throw new Error("Property has no images");

    // Call AI to detect focal point using tool calling
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are an image analysis assistant. You analyse property photos and determine the focal point where the main subject (usually the building facade or front of the property) is located.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyse this property photo. Determine where the most important subject (the building front/facade) is centred. Return the focal point as x% (horizontal, 0=left, 100=right) and y% (vertical, 0=top, 100=bottom). For most property exterior shots the building is centred horizontally (around 50) but sits in the lower portion of the frame (around 55-70 for y).",
                },
                {
                  type: "image_url",
                  image_url: { url: imageUrl },
                },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "set_focal_point",
                description:
                  "Set the focal point coordinates for the property image.",
                parameters: {
                  type: "object",
                  properties: {
                    x: {
                      type: "number",
                      description:
                        "Horizontal focal point as a percentage (0-100). 0 = left edge, 100 = right edge.",
                    },
                    y: {
                      type: "number",
                      description:
                        "Vertical focal point as a percentage (0-100). 0 = top edge, 100 = bottom edge.",
                    },
                  },
                  required: ["x", "y"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "set_focal_point" },
          },
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI did not return a focal point");

    const focalPoint = JSON.parse(toolCall.function.arguments);
    const x = Math.max(0, Math.min(100, Math.round(focalPoint.x)));
    const y = Math.max(0, Math.min(100, Math.round(focalPoint.y)));

    // Update the property
    const { error: updateError } = await supabase
      .from("properties")
      .update({ cover_focal_point: { x, y } })
      .eq("id", propertyId);

    if (updateError) throw new Error(`Failed to update property: ${updateError.message}`);

    return new Response(JSON.stringify({ x, y }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("detect-focal-point error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
