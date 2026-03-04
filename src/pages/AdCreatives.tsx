import { AppLayout } from "@/components/layout/AppLayout";
import { AdCreativeCard, type AdCreativeConfig } from "@/components/admin/AdCreativeCard";
import { Megaphone } from "lucide-react";

const creatives: AdCreativeConfig[] = [
  // --- SQUARE FEED ADS ---
  {
    id: "urgency-speed",
    headline: "Sell Your Property\nin 24 Hours",
    subheadline: "Get a guaranteed cash offer with zero delays.\nWe handle everything so you don't have to.",
    cta: "Get Your Cash Offer →",
    badge: "⚡ FAST SALE",
    aspect: "square",
    variant: "navy",
    decorStyle: "circles",
    stats: [
      { value: "24h", label: "Average Offer" },
      { value: "£0", label: "Agent Fees" },
      { value: "98%", label: "Completion Rate" },
    ],
  },
  {
    id: "pain-relief",
    headline: "Cash Offers.\nNo Fees.\nNo Chains.",
    subheadline: "Skip the estate agents, skip the stress.\nSell directly to verified investors today.",
    cta: "Sell Without the Hassle →",
    aspect: "square",
    variant: "teal",
    decorStyle: "geometric",
    bulletPoints: [
      "No estate agent fees",
      "No lengthy chains",
      "Complete in as little as 7 days",
      "Cash buyer network ready",
    ],
  },
  {
    id: "free-valuation",
    headline: "What's Your\nProperty Worth?",
    subheadline: "Get a free, no-obligation cash valuation\nfrom verified buyers — takes 60 seconds.",
    cta: "Free Instant Valuation →",
    badge: "100% FREE • NO OBLIGATION",
    aspect: "square",
    variant: "white",
    decorStyle: "dots",
  },
  {
    id: "social-proof",
    headline: "Trusted by\n1,200+ Investors",
    subheadline: "Join hundreds of sellers who've received\nfair, fast cash offers through our platform.",
    cta: "List Your Property →",
    badge: "★★★★★  RATED 4.9/5",
    aspect: "square",
    variant: "gradient",
    decorStyle: "lines",
    stats: [
      { value: "1,200+", label: "Verified Buyers" },
      { value: "£48M+", label: "Deals Completed" },
    ],
  },
  {
    id: "inherited-property",
    headline: "Inherited a\nProperty?",
    subheadline: "We'll take the stress away with a fair cash offer.\nNo repairs needed. Sell as-is.",
    cta: "Get a Cash Offer →",
    aspect: "square",
    variant: "navy",
    decorStyle: "geometric",
    bulletPoints: [
      "Sell in any condition",
      "No renovation required",
      "Probate support available",
    ],
  },

  // --- STORY ADS ---
  {
    id: "urgency-story",
    headline: "Need to\nSell Fast?",
    subheadline: "Cash offers within 24 hours.\nNo fees. No viewings.\nNo chains.",
    cta: "Get Your Offer Now →",
    badge: "⚡ FAST SALE",
    aspect: "story",
    variant: "navy",
    decorStyle: "circles",
    stats: [
      { value: "24h", label: "Offer Speed" },
      { value: "7 Days", label: "To Complete" },
    ],
  },
  {
    id: "valuation-story",
    headline: "Free Property\nValuation",
    subheadline: "Find out what cash buyers\nwill pay for your property.\nNo strings attached.",
    cta: "Get Free Valuation →",
    aspect: "story",
    variant: "teal",
    decorStyle: "dots",
    bulletPoints: [
      "Takes 60 seconds",
      "100% free, no obligation",
      "Instant results from real buyers",
    ],
  },
  {
    id: "gradient-story",
    headline: "Your Property.\nOur Buyers.\nFast Cash.",
    subheadline: "Connect directly with 1,200+ verified\ncash investors. No middlemen.",
    cta: "Submit Your Property →",
    aspect: "story",
    variant: "gradient",
    decorStyle: "lines",
    stats: [
      { value: "£0", label: "Fees" },
      { value: "1,200+", label: "Buyers" },
      { value: "4.9★", label: "Rating" },
    ],
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
