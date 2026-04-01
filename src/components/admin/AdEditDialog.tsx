import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { AdCreativeConfig } from "./AdCreativeCard";

const VARIANTS = [
  { value: "navy", label: "Navy", bg: "bg-[hsl(220,40%,20%)]" },
  { value: "teal", label: "Teal", bg: "bg-[hsl(180,50%,35%)]" },
  { value: "white", label: "White", bg: "bg-white border border-border" },
  { value: "gradient", label: "Gradient", bg: "bg-gradient-to-br from-[hsl(220,40%,20%)] to-[hsl(180,50%,35%)]" },
  { value: "dark", label: "Dark", bg: "bg-[hsl(220,20%,12%)]" },
  { value: "split", label: "Split", bg: "bg-gradient-to-r from-[hsl(220,40%,20%)] to-[hsl(180,50%,35%)]" },
] as const;

const DECOR_STYLES = ["none", "circles", "lines", "dots", "geometric", "waves", "grid"] as const;

interface AdEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: AdCreativeConfig;
  original: AdCreativeConfig;
  onSave: (updated: Partial<AdCreativeConfig>) => void;
  onReset: () => void;
}

export function AdEditDialog({ open, onOpenChange, config, original, onSave, onReset }: AdEditDialogProps) {
  const [headline, setHeadline] = useState(config.headline);
  const [subheadline, setSubheadline] = useState(config.subheadline);
  const [cta, setCta] = useState(config.cta);
  const [badge, setBadge] = useState(config.badge || "");
  const [bulletPoints, setBulletPoints] = useState<string[]>(config.bulletPoints || []);
  const [stats, setStats] = useState<{ value: string; label: string }[]>(config.stats || []);
  const [variant, setVariant] = useState(config.variant);
  const [decorStyle, setDecorStyle] = useState(config.decorStyle || "none");

  const handleSave = () => {
    onSave({
      headline,
      subheadline,
      cta,
      badge: badge || undefined,
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
      stats: stats.length > 0 ? stats : undefined,
      variant,
      decorStyle: decorStyle === "none" ? undefined : decorStyle,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setHeadline(original.headline);
    setSubheadline(original.subheadline);
    setCta(original.cta);
    setBadge(original.badge || "");
    setBulletPoints(original.bulletPoints || []);
    setStats(original.stats || []);
    setVariant(original.variant);
    setDecorStyle(original.decorStyle || "none");
    onReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Creative — {config.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Headline</Label>
            <Textarea value={headline} onChange={(e) => setHeadline(e.target.value)} rows={3} />
          </div>

          <div>
            <Label>Subheadline</Label>
            <Textarea value={subheadline} onChange={(e) => setSubheadline(e.target.value)} rows={3} />
          </div>

          <div>
            <Label>CTA Text</Label>
            <Input value={cta} onChange={(e) => setCta(e.target.value)} />
          </div>

          <div>
            <Label>Badge (optional)</Label>
            <Input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. ⚡ FAST SALE" />
          </div>

          {/* Bullet Points */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Bullet Points</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => setBulletPoints([...bulletPoints, ""])}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
            {bulletPoints.map((bp, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <Input
                  value={bp}
                  onChange={(e) => {
                    const next = [...bulletPoints];
                    next[i] = e.target.value;
                    setBulletPoints(next);
                  }}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setBulletPoints(bulletPoints.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Stats</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => setStats([...stats, { value: "", label: "" }])}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
            {stats.map((stat, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <Input
                  placeholder="Value"
                  value={stat.value}
                  onChange={(e) => {
                    const next = [...stats];
                    next[i] = { ...next[i], value: e.target.value };
                    setStats(next);
                  }}
                />
                <Input
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => {
                    const next = [...stats];
                    next[i] = { ...next[i], label: e.target.value };
                    setStats(next);
                  }}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setStats(stats.filter((_, j) => j !== i))}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
