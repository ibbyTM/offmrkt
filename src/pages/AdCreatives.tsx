import { useState, useCallback, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdCreativeCard, type AdCreativeConfig } from "@/components/admin/AdCreativeCard";
import { Megaphone } from "lucide-react";
import { creatives } from "@/data/adCreatives";

export default function AdCreatives() {
  const [items, setItems] = useState<AdCreativeConfig[]>(() => [...creatives]);
  const originals = useRef(creatives);

  const handleUpdate = useCallback((id: string, updates: Partial<AdCreativeConfig>) => {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const squares = items.filter((c) => c.aspect === "square");
  const stories = items.filter((c) => c.aspect === "story");
  const portraits = items.filter((c) => c.aspect === "portrait");
  const landscapes = items.filter((c) => c.aspect === "landscape");

  const renderSection = (title: string, subtitle: string, list: AdCreativeConfig[]) => (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {list.map((c) => (
          <AdCreativeCard key={c.id} config={c} original={originals.current.find((o) => o.id === c.id)!} onUpdate={(u) => handleUpdate(c.id, u)} />
        ))}
      </div>
    </section>
  );

  return (
    <AppLayout
      pageTitle="Ad Creatives"
      pageSubtitle="Download ready-to-use social media ad & post templates"
      pageIcon={<Megaphone className="h-5 w-5 text-primary" />}
    >
      <div className="p-4 sm:p-6 space-y-10">
        {renderSection("Feed Ads (1080×1080)", "Optimised for Facebook & Instagram feed placements", squares)}
        {renderSection("Story Ads (1080×1920)", "Optimised for Instagram & Facebook Stories", stories)}
        {renderSection("Portrait Posts (1080×1350)", "Instagram portrait posts, carousels & educational content", portraits)}
        {renderSection("Landscape Posts (1200×628)", "Facebook & LinkedIn link previews, announcements & blog cards", landscapes)}
      </div>
    </AppLayout>
  );
}
