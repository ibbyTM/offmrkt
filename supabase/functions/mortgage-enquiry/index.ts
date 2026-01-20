import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MortgageEnquiryRequest {
  // Contact info
  full_name: string;
  email: string;
  phone: string;
  
  // Enquiry details
  enquiry_type: "purchase" | "remortgage";
  message?: string;
  
  // Financial
  annual_income?: number;
  has_aip: boolean;
  budget_min?: number;
  budget_max?: number;
  cash_available?: string;
  funding_source?: string;
  
  // Experience
  properties_owned: number;
  investment_experience?: string;
  
  // Timing
  purchase_timeline?: string;
  
  // Preferences
  is_uk_resident: boolean;
  prefers_remote: boolean;
  
  // Property details (if applicable)
  property_id?: string;
  property_address?: string;
  property_value?: number;
  property_type?: string;
  deposit_amount?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const ghlWebhookUrl = Deno.env.get("GHL_WEBHOOK_URL");

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !claims?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claims.claims.sub as string;
    const data: MortgageEnquiryRequest = await req.json();

    console.log("Processing mortgage enquiry for user:", userId);

    // Calculate derived fields
    const isFirstTimeBtl = data.properties_owned === 0;

    // 1. Save to mortgage_referrals table
    const { error: insertError } = await supabase.from("mortgage_referrals").insert({
      user_id: userId,
      property_id: data.property_id || null,
      referrer_url: null,
      // Investor snapshot
      min_budget: data.budget_min || null,
      max_budget: data.budget_max || null,
      cash_available: data.cash_available || null,
      mortgage_approved: data.has_aip || null,
      funding_source: data.funding_source || null,
      purchase_timeline: data.purchase_timeline || null,
      investment_experience: data.investment_experience || null,
      properties_owned: data.properties_owned,
      // Contact info
      investor_name: data.full_name,
      investor_email: data.email,
      investor_phone: data.phone || null,
      // Enhanced fields
      enquiry_type: data.enquiry_type,
      annual_income: data.annual_income || null,
      is_uk_resident: data.is_uk_resident,
      prefers_remote: data.prefers_remote,
      is_first_time_btl: isFirstTimeBtl,
      property_type: data.property_type || null,
      property_value: data.property_value || null,
      property_address: data.property_address || null,
    });

    if (insertError) {
      console.error("Error saving referral:", insertError);
      throw new Error("Failed to save enquiry");
    }

    console.log("Referral saved to database");

    // 2. Send to GoHighLevel webhook
    if (ghlWebhookUrl) {
      const ghlPayload = {
        // Contact fields for GHL
        email: data.email,
        phone: data.phone,
        first_name: data.full_name.split(" ")[0] || data.full_name,
        last_name: data.full_name.split(" ").slice(1).join(" ") || "",
        full_name: data.full_name,
        
        // Custom fields
        enquiry_type: data.enquiry_type,
        annual_income: data.annual_income || null,
        is_uk_resident: data.is_uk_resident,
        prefers_remote: data.prefers_remote,
        budget_min: data.budget_min || null,
        budget_max: data.budget_max || null,
        cash_available: data.cash_available || null,
        has_aip: data.has_aip,
        purchase_timeline: data.purchase_timeline || null,
        properties_owned: data.properties_owned,
        is_first_time_btl: isFirstTimeBtl,
        investment_experience: data.investment_experience || null,
        funding_source: data.funding_source || null,
        
        // Property info
        property_id: data.property_id || null,
        property_address: data.property_address || null,
        property_value: data.property_value || null,
        property_type: data.property_type || null,
        deposit_amount: data.deposit_amount || null,
        
        // Additional message
        message: data.message || null,
        
        // Metadata
        source: "offmrkt_mortgage_page",
        submitted_at: new Date().toISOString(),
      };

      try {
        const ghlResponse = await fetch(ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ghlPayload),
        });

        if (!ghlResponse.ok) {
          console.error("GHL webhook failed:", await ghlResponse.text());
          // Don't fail the request, just log it
        } else {
          console.log("Successfully sent to GoHighLevel");
        }
      } catch (ghlError) {
        console.error("Error calling GHL webhook:", ghlError);
        // Don't fail the request, just log it
      }
    } else {
      console.log("GHL_WEBHOOK_URL not configured, skipping webhook");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Enquiry submitted successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error processing mortgage enquiry:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
