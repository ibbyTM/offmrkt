import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Pencil } from "lucide-react";
import { AdEditDialog } from "./AdEditDialog";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export interface AdCreativeConfig {
  id: string;
  headline: string;
  subheadline: string;
  cta: string;
  badge?: string;
  aspect: "square" | "story" | "portrait" | "landscape";
  variant: "navy" | "teal" | "white" | "gradient" | "dark" | "split";
  stats?: { value: string; label: string }[];
  bulletPoints?: string[];
  decorStyle?: "circles" | "lines" | "dots" | "geometric" | "waves" | "grid" | "none";
}

const DIMENSIONS: Record<AdCreativeConfig["aspect"], { w: number; h: number }> = {
  square: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
  portrait: { w: 1080, h: 1350 },
  landscape: { w: 1200, h: 628 },
};

/* ---- Decoration components ---- */

function DecoCircles({ variant }: { variant: string }) {
  const color = variant === "white" || variant === "gradient" || variant === "split" ? "rgba(20,184,166,0.08)" : "rgba(255,255,255,0.06)";
  return (
    <>
      <div style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: color }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: color }} />
      <div style={{ position: "absolute", top: "50%", left: -60, width: 200, height: 200, borderRadius: "50%", background: color }} />
    </>
  );
}

function DecoLines({ variant }: { variant: string }) {
  const color = variant === "white" || variant === "gradient" || variant === "split" ? "rgba(30,58,90,0.06)" : "rgba(255,255,255,0.05)";
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ position: "absolute", top: 0, left: 60 + i * 130, width: 2, height: "100%", background: color }} />
      ))}
    </>
  );
}

function DecoDots({ variant }: { variant: string }) {
  const color = variant === "white" || variant === "gradient" || variant === "split" ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.08)";
  const dots = [];
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 12; c++) {
      dots.push(
        <div key={`${r}-${c}`} style={{ position: "absolute", top: 60 + r * 85, left: 60 + c * 85, width: 8, height: 8, borderRadius: "50%", background: color }} />
      );
    }
  }
  return <>{dots}</>;
}

function DecoGeometric({ variant }: { variant: string }) {
  const color = variant === "white" || variant === "gradient" || variant === "split" ? "rgba(20,184,166,0.07)" : "rgba(255,255,255,0.06)";
  const border = variant === "white" || variant === "gradient" || variant === "split" ? "rgba(30,58,90,0.08)" : "rgba(255,255,255,0.08)";
  return (
    <>
      <div style={{ position: "absolute", top: 40, right: 40, width: 200, height: 200, border: `3px solid ${border}`, borderRadius: 24, transform: "rotate(15deg)" }} />
      <div style={{ position: "absolute", bottom: 100, left: 40, width: 160, height: 160, border: `3px solid ${border}`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "40%", right: 80, width: 120, height: 120, background: color, borderRadius: 20, transform: "rotate(-10deg)" }} />
      <div style={{ position: "absolute", bottom: 200, right: 60, width: 80, height: 80, background: color, borderRadius: "50%" }} />
    </>
  );
}

function DecoWaves({ variant }: { variant: string }) {
  const color = variant === "white" || variant === "split" ? "rgba(20,184,166,0.06)" : "rgba(255,255,255,0.05)";
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: -200 + i * 120,
            left: -100,
            width: "140%",
            height: 400,
            borderRadius: "50%",
            background: color,
          }}
        />
      ))}
    </>
  );
}

function DecoGrid({ variant }: { variant: string }) {
  const color = variant === "white" || variant === "split" ? "rgba(30,58,90,0.04)" : "rgba(255,255,255,0.04)";
  return (
    <>
      {[...Array(14)].map((_, i) => (
        <div key={`h${i}`} style={{ position: "absolute", top: i * 80, left: 0, width: "100%", height: 1, background: color }} />
      ))}
      {[...Array(14)].map((_, i) => (
        <div key={`v${i}`} style={{ position: "absolute", top: 0, left: i * 80, width: 1, height: "100%", background: color }} />
      ))}
    </>
  );
}

function Decorations({ style, variant }: { style: AdCreativeConfig["decorStyle"]; variant: string }) {
  switch (style) {
    case "circles": return <DecoCircles variant={variant} />;
    case "lines": return <DecoLines variant={variant} />;
    case "dots": return <DecoDots variant={variant} />;
    case "geometric": return <DecoGeometric variant={variant} />;
    case "waves": return <DecoWaves variant={variant} />;
    case "grid": return <DecoGrid variant={variant} />;
    default: return null;
  }
}

/* ---- Variant styling helpers ---- */

function getVariantStyles(variant: AdCreativeConfig["variant"]) {
  const bgStyle: React.CSSProperties =
    variant === "gradient"
      ? { background: "linear-gradient(135deg, #1E3A5A 0%, #14B8A6 100%)" }
      : variant === "split"
      ? { background: "linear-gradient(180deg, #1E3A5A 50%, #FFFFFF 50%)" }
      : {};

  const bgClass =
    variant === "navy" ? "bg-[#1E3A5A]"
    : variant === "teal" ? "bg-[#14B8A6]"
    : variant === "white" ? "bg-white"
    : variant === "dark" ? "bg-[#0F172A]"
    : "";

  const textColor = variant === "white" ? "text-[#1E3A5A]" : "text-white";
  const subTextOpacity = variant === "white" ? "opacity-60" : "opacity-75";

  const ctaBg =
    variant === "teal" ? "bg-[#1E3A5A] text-white"
    : variant === "white" ? "bg-[#14B8A6] text-white"
    : variant === "dark" ? "bg-[#14B8A6] text-white"
    : variant === "split" ? "bg-[#14B8A6] text-white"
    : "bg-white text-[#1E3A5A]";

  const badgeBg =
    variant === "white" ? "bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20"
    : "bg-white/15 text-white border border-white/20";

  const accentLine = variant === "white" ? "bg-[#14B8A6]" : "bg-white/40";

  return { bgStyle, bgClass, textColor, subTextOpacity, ctaBg, badgeBg, accentLine };
}

export function AdCreativeCard({ config, original, onUpdate }: { config: AdCreativeConfig; original: AdCreativeConfig; onUpdate: (updates: Partial<AdCreativeConfig>) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const isMobile = useIsMobile();

  const { w, h } = DIMENSIONS[config.aspect];
  const isStory = config.aspect === "story";
  const isLandscape = config.aspect === "landscape";

  const scale = isMobile
    ? (isStory ? 0.22 : isLandscape ? 0.26 : 0.28)
    : (isStory ? 0.35 : isLandscape ? 0.32 : 0.35);
  const previewW = w * scale;
  const previewH = h * scale;

  const { bgStyle, bgClass, textColor, subTextOpacity, ctaBg, badgeBg, accentLine } = getVariantStyles(config.variant);

  // Font sizes scale with aspect
  const headlineSize = isLandscape ? 52 : isStory ? 78 : 68;
  const subSize = isLandscape ? 26 : isStory ? 38 : 34;
  const statSize = isLandscape ? 40 : 52;
  const statLabelSize = isLandscape ? 18 : 22;
  const ctaSize = isLandscape ? 26 : 32;
  const bulletSize = isLandscape ? 24 : 30;

  const handleDownload = async () => {
    if (!ref.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(ref.current, {
        width: w, height: h, pixelRatio: 1,
        style: { transform: "none", width: `${w}px`, height: `${h}px` },
      });
      const link = document.createElement("a");
      link.download = `offmrkt-${config.id}-${config.aspect}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Creative downloaded!");
    } catch {
      toast.error("Failed to export image");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-border overflow-hidden shadow-sm" style={{ width: previewW, height: previewH }}>
        <div
          ref={ref}
          className={`${bgClass} flex flex-col items-center justify-between relative overflow-hidden`}
          style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left", fontFamily: "'Inter', sans-serif", ...bgStyle }}
        >
          <Decorations style={config.decorStyle || "none"} variant={config.variant} />

          {config.badge && (
            <div className="absolute top-[50px] left-1/2 -translate-x-1/2 z-10">
              <span className={`${badgeBg} px-[36px] py-[14px] rounded-full font-bold tracking-wide`} style={{ fontSize: 24 }}>
                {config.badge}
              </span>
            </div>
          )}

          <div className={`flex-1 flex flex-col items-center justify-center ${isLandscape ? "px-[60px]" : "px-[90px]"} text-center gap-[${isLandscape ? "20" : "36"}px] z-10`}>
            <div className={`rounded-2xl ${config.variant === "white" ? "border border-[#e5e5e5]" : "bg-white"} p-[18px] mb-[10px] shadow-sm`}>
              <img src="/assets/offthemarkets-logo.png" alt="Off The Markets" style={{ height: isLandscape ? 40 : 54, width: "auto" }} crossOrigin="anonymous" />
            </div>

            <div className={`${accentLine} rounded-full`} style={{ width: 80, height: 5 }} />

            <h2 className={`${textColor} font-extrabold leading-[1.05] tracking-tight`} style={{ fontSize: headlineSize, whiteSpace: "pre-line" }}>
              {config.headline}
            </h2>

            <p className={`${textColor} ${subTextOpacity} font-medium leading-snug`} style={{ fontSize: subSize, whiteSpace: "pre-line", maxWidth: 900 }}>
              {config.subheadline}
            </p>

            {config.bulletPoints && config.bulletPoints.length > 0 && (
              <div className="flex flex-col gap-[20px] mt-[10px]" style={{ fontSize: bulletSize }}>
                {config.bulletPoints.map((bp, i) => (
                  <div key={i} className={`flex items-center gap-[16px] ${textColor} ${subTextOpacity}`}>
                    <div className={`${config.variant === "white" ? "bg-[#14B8A6]" : "bg-white"} rounded-full flex items-center justify-center`} style={{ width: 36, height: 36, minWidth: 36 }}>
                      <span className={`${config.variant === "white" ? "text-white" : "text-[#1E3A5A]"} font-bold`} style={{ fontSize: 20 }}>✓</span>
                    </div>
                    <span className="font-medium text-left">{bp}</span>
                  </div>
                ))}
              </div>
            )}

            {config.stats && config.stats.length > 0 && (
              <div className="flex gap-[40px] mt-[20px]">
                {config.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className={`${textColor} font-extrabold`} style={{ fontSize: statSize }}>{stat.value}</span>
                    <span className={`${textColor} ${subTextOpacity} font-medium`} style={{ fontSize: statLabelSize }}>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`${isLandscape ? "pb-[40px]" : "pb-[70px]"} z-10`}>
            <div className={`${ctaBg} rounded-full font-bold px-[56px] py-[26px] shadow-lg`} style={{ fontSize: ctaSize, letterSpacing: "0.02em" }}>
              {config.cta}
            </div>
          </div>

          <div className={`w-full py-[22px] text-center ${subTextOpacity} ${textColor} z-10`} style={{ fontSize: 20, letterSpacing: "0.1em" }}>
            OFF-THE-MARKETS.COM
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between" style={{ width: previewW }}>
        <span className="text-xs text-muted-foreground font-medium truncate">{config.id}</span>
        <div className="flex gap-1.5 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            PNG
          </Button>
        </div>
      </div>

      <AdEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        config={config}
        original={original}
        onSave={onUpdate}
        onReset={() => onUpdate({ ...original })}
      />
    </div>
  );
}
