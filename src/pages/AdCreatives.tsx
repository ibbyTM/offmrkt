import { useState, useCallback, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdCreativeCard, type AdCreativeConfig } from "@/components/admin/AdCreativeCard";
import { Megaphone } from "lucide-react";
import { sellerCreatives, investorCreatives } from "@/data/adCreatives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdCreatives() {
  const [sellerItems, setSellerItems] = useState<AdCreativeConfig[]>(() => [...sellerCreatives]);
  const [investorItems, setInvestorItems] = useState<AdCreativeConfig[]>(() => [...investorCreatives]);
  const sellerOriginals = useRef(sellerCreatives);
  const investorOriginals = useRef(investorCreatives);

  const handleSellerUpdate = useCallback((id: string, updates: Partial<AdCreativeConfig>) => {
    setSellerItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const handleInvestorUpdate = useCallback((id: string, updates: Partial<AdCreativeConfig>) => {
    setInvestorItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const renderSection = (
    title: string,
    subtitle: string,
    list: AdCreativeConfig[],
    originals: AdCreativeConfig[],
    onUpdate: (id: string, updates: Partial<AdCreativeConfig>) => void
  ) => (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {list.map((c) => (
          <AdCreativeCard key={c.id} config={c} original={originals.find((o) => o.id === c.id)!} onUpdate={(u) => onUpdate(c.id, u)} />
        ))}
      </div>
    </section>
  );

  const renderCreativeSet = (
    items: AdCreativeConfig[],
    originals: AdCreativeConfig[],
    onUpdate: (id: string, updates: Partial<AdCreativeConfig>) => void
  ) => {
    const squares = items.filter((c) => c.aspect === "square");
    const stories = items.filter((c) => c.aspect === "story");
    const portraits = items.filter((c) => c.aspect === "portrait");
    const landscapes = items.filter((c) => c.aspect === "landscape");

    return (
      <div className="space-y-10">
        {renderSection("Feed Ads (1080×1080)", "Optimised for Facebook & Instagram feed placements", squares, originals, onUpdate)}
        {renderSection("Story Ads (1080×1920)", "Optimised for Instagram & Facebook Stories", stories, originals, onUpdate)}
        {renderSection("Portrait Posts (1080×1350)", "Instagram portrait posts, carousels & educational content", portraits, originals, onUpdate)}
        {renderSection("Landscape Posts (1200×628)", "Facebook & LinkedIn link previews, announcements & blog cards", landscapes, originals, onUpdate)}
      </div>
    );
  };

  return (
    <AppLayout
      pageTitle="Ad Creatives"
      pageSubtitle="Download ready-to-use social media ad & post templates"
      pageIcon={<Megaphone className="h-5 w-5 text-primary" />}
    >
      <div className="p-4 sm:p-6">
        <Tabs defaultValue="seller" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="seller">Seller Creatives</TabsTrigger>
            <TabsTrigger value="investor">Investor Creatives</TabsTrigger>
          </TabsList>
          <TabsContent value="seller">
            {renderCreativeSet(sellerItems, sellerOriginals.current, handleSellerUpdate)}
          </TabsContent>
          <TabsContent value="investor">
            {renderCreativeSet(investorItems, investorOriginals.current, handleInvestorUpdate)}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
