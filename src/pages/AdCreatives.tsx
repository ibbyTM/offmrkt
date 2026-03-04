import { AppLayout } from "@/components/layout/AppLayout";
import { AdCreativeCard, type AdCreativeConfig } from "@/components/admin/AdCreativeCard";
import { Megaphone } from "lucide-react";

const creatives: AdCreativeConfig[] = [
  {
    id: "urgency-speed",
    headline: "Sell Your Property in 24 Hours",
    subheadline: "Get a guaranteed cash offer with no delays. We handle everything so you don't have to.",
    cta: "Get Your Cash Offer →",
    badge: "⚡ FAST SALE",
    aspect: "square",
    variant: "navy",
  },
  {
    id: "pain-relief",
    headline: "Cash Offers.\nNo Fees.\nNo Chains.",
    subheadline: "Skip the agents, skip the stress. Sell directly to verified investors today.",
    cta: "Sell Without the Hassle →",
    aspect: "square",
    variant: "teal",
  },
  {
    id: "free-valuation",
    headline: "Get a Free Valuation Today",
    subheadline: "Find out what your property is worth to cash buyers — no strings attached.",
    cta: "Free Valuation →",
    badge: "100% FREE",
    aspect: "square",
    variant: "white",
  },
  {
    id: "social-proof",
    headline: "Trusted by 1,200+ Investors",
    subheadline: "Join hundreds of sellers who've already received fair, fast cash offers through our platform.",
    cta: "List Your Property →",
    badge: "★ RATED 4.9/5",
    aspect: "square",
    variant: "navy",
  },
  {
    id: "urgency-story",
    headline: "Need to Sell Fast?",
    subheadline: "Cash offers within 24 hours.\nNo fees. No viewings.\nNo chains.",
    cta: "Get Your Offer Now →",
    badge: "⚡ FAST SALE",
    aspect: "story",
    variant: "navy",
  },
  {
    id: "valuation-story",
    headline: "What's Your Property Worth?",
    subheadline: "Get a free, no-obligation valuation from verified cash buyers in minutes.",
    cta: "Free Valuation →",
    aspect: "story",
    variant: "teal",
  },
];

export default function AdCreatives() {
  const squares = creatives.filter((c) => c.aspect === "square");
  const stories = creatives.filter((c) => c.aspect === "story");

  return (
    <AppLayout
      pageTitle="Ad Creatives"
      pageSubtitle="Download ready-to-use Facebook & Instagram ad templates"
      pageIcon={<Megaphone className="h-5 w-5 text-primary" />}
    >
      <div className="p-6 space-y-10">
        {/* Square ads */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-1">Feed Ads (1080×1080)</h2>
          <p className="text-sm text-muted-foreground mb-4">Optimised for Facebook & Instagram feed placements</p>
          <div className="flex flex-wrap gap-6">
            {squares.map((c) => (
              <AdCreativeCard key={c.id} config={c} />
            ))}
          </div>
        </section>

        {/* Story ads */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-1">Story Ads (1080×1920)</h2>
          <p className="text-sm text-muted-foreground mb-4">Optimised for Instagram & Facebook Stories</p>
          <div className="flex flex-wrap gap-6">
            {stories.map((c) => (
              <AdCreativeCard key={c.id} config={c} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
