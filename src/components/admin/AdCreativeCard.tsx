import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface AdCreativeConfig {
  id: string;
  headline: string;
  subheadline: string;
  cta: string;
  badge?: string;
  aspect: "square" | "story";
  variant: "navy" | "teal" | "white";
}

const SCALE = 0.35; // preview scale

export function AdCreativeCard({ config }: { config: AdCreativeConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const isStory = config.aspect === "story";
  const w = 1080;
  const h = isStory ? 1920 : 1080;

  const bg =
    config.variant === "navy"
      ? "bg-[#1E3A5A]"
      : config.variant === "teal"
      ? "bg-[#14B8A6]"
      : "bg-white";

  const textColor =
    config.variant === "white" ? "text-[#1E3A5A]" : "text-white";

  const ctaBg =
    config.variant === "teal"
      ? "bg-[#1E3A5A] text-white"
      : config.variant === "navy"
      ? "bg-[#14B8A6] text-white"
      : "bg-[#14B8A6] text-white";

  const badgeBg =
    config.variant === "white"
      ? "bg-[#14B8A6]/10 text-[#14B8A6]"
      : "bg-white/20 text-white";

  const handleDownload = async () => {
    if (!ref.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(ref.current, {
        width: w,
        height: h,
        pixelRatio: 1,
        style: { transform: "none", width: `${w}px`, height: `${h}px` },
      });
      const link = document.createElement("a");
      link.download = `${config.id}-${config.aspect}.png`;
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
      {/* Preview container */}
      <div
        className="rounded-xl border border-border overflow-hidden shadow-sm"
        style={{ width: w * SCALE, height: h * SCALE }}
      >
        <div
          ref={ref}
          className={`${bg} flex flex-col items-center justify-between relative`}
          style={{
            width: w,
            height: h,
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Top badge */}
          {config.badge && (
            <div className="absolute top-[60px] left-1/2 -translate-x-1/2">
              <span
                className={`${badgeBg} px-[40px] py-[16px] rounded-full font-semibold`}
                style={{ fontSize: 28 }}
              >
                {config.badge}
              </span>
            </div>
          )}

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center px-[80px] text-center gap-[40px]">
            {/* Logo area */}
            <div
              className={`rounded-2xl ${config.variant === "white" ? "" : "bg-white"} p-[20px] mb-[20px]`}
            >
              <img
                src="/assets/offthemarkets-logo.png"
                alt="Off The Markets"
                style={{ height: 60, width: "auto" }}
                crossOrigin="anonymous"
              />
            </div>

            <h2
              className={`${textColor} font-extrabold leading-[1.1] tracking-tight`}
              style={{ fontSize: isStory ? 80 : 72 }}
            >
              {config.headline}
            </h2>

            <p
              className={`${textColor} opacity-80 font-medium leading-snug`}
              style={{ fontSize: isStory ? 40 : 36 }}
            >
              {config.subheadline}
            </p>
          </div>

          {/* CTA button */}
          <div className="pb-[80px]">
            <div
              className={`${ctaBg} rounded-full font-bold px-[60px] py-[28px]`}
              style={{ fontSize: 34 }}
            >
              {config.cta}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className={`w-full py-[24px] text-center opacity-60 ${textColor}`}
            style={{ fontSize: 22 }}
          >
            off-the-markets.com
          </div>
        </div>
      </div>

      {/* Download button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={downloading}
        className="w-fit"
      >
        {downloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Download PNG
      </Button>
    </div>
  );
}
