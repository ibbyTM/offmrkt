import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface MatchResult {
  investorId: string;
  email: string;
  name: string;
  matchType: "full" | "partial";
  matchedCriteria: string[];
}

function maskAddress(address: string): string {
  // Strip leading unit/flat prefix (e.g. "Flat 3, ", "Unit 5, ")
  let masked = address.replace(/^(flat|unit|apt|apartment)\s+\S+[,\s]+/i, "");
  // Strip leading house number (e.g. "42 ", "10a ")
  masked = masked.replace(/^\d+\w?\s+/, "");
  return masked || address;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { propertyId } = await req.json();
    if (!propertyId) {
      return new Response(JSON.stringify({ error: "propertyId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch property
    const { data: property, error: propErr } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (propErr || !property) {
      return new Response(JSON.stringify({ error: "Property not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch approved investors
    const { data: investors, error: invErr } = await supabase
      .from("investor_applications")
      .select("id, user_id, min_budget, max_budget, preferred_locations, preferred_strategies")
      .eq("status", "approved");

    if (invErr || !investors?.length) {
      return new Response(JSON.stringify({ matched: 0, message: "No approved investors" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch profiles for all investor user_ids
    const userIds = investors.map((i) => i.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .in("user_id", userIds);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.user_id, p])
    );

    // Match investors
    const matches: MatchResult[] = [];

    for (const investor of investors) {
      const profile = profileMap.get(investor.user_id);
      if (!profile?.email) continue;

      const matchedCriteria: string[] = [];

      // Budget match
      const price = property.asking_price;
      if (price >= investor.min_budget && price <= investor.max_budget) {
        matchedCriteria.push("budget");
      }

      // Location match (case-insensitive)
      const propertyCity = (property.property_city || "").toLowerCase();
      const prefLocations = (investor.preferred_locations || []).map((l: string) => l.toLowerCase());
      if (prefLocations.some((loc: string) => propertyCity.includes(loc) || loc.includes(propertyCity))) {
        matchedCriteria.push("location");
      }

      // Strategy match
      const propertyStrategies = property.strategies || [];
      const prefStrategies = investor.preferred_strategies || [];
      if (prefStrategies.some((s: string) => propertyStrategies.includes(s))) {
        matchedCriteria.push("strategy");
      }

      if (matchedCriteria.length === 0) continue;

      matches.push({
        investorId: investor.id,
        email: profile.email,
        name: profile.full_name || "Investor",
        matchType: matchedCriteria.length === 3 ? "full" : "partial",
        matchedCriteria,
      });
    }

    // Send emails
    let sent = 0;
    for (const match of matches) {
      const formatType = (t?: string) =>
        t ? t.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : "—";

      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "new-property-alert",
          recipientEmail: match.email,
          idempotencyKey: `property-alert-${propertyId}-${match.investorId}`,
          templateData: {
            name: match.name,
            propertyAddress: maskAddress(property.property_address),
            city: property.property_city,
            askingPrice: property.asking_price,
            grossYield: property.gross_yield_percentage,
            propertyType: property.property_type,
            strategy: (property.strategies || [])[0] || "",
            propertyId: property.id,
            matchType: match.matchType,
            matchedCriteria: match.matchedCriteria.map(formatType),
          },
        },
      });
      sent++;
    }

    return new Response(
      JSON.stringify({
        matched: matches.length,
        fullMatches: matches.filter((m) => m.matchType === "full").length,
        partialMatches: matches.filter((m) => m.matchType === "partial").length,
        sent,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("notify-matching-investors error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
