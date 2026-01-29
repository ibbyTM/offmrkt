import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { Loader2, Download, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

type LogoVariant = "default" | "icon_only" | "wordmark";

interface GeneratedLogo {
  image: string;
  description: string;
  variant: LogoVariant;
}

const variantLabels: Record<LogoVariant, { title: string; description: string }> = {
  default: {
    title: "Full Logo",
    description: "Icon + wordmark combination",
  },
  icon_only: {
    title: "Icon Only",
    description: "Standalone symbol for favicon/app icon",
  },
  wordmark: {
    title: "Wordmark",
    description: "Typography-focused with subtle M-roof",
  },
};

export default function LogoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<LogoVariant>("default");
  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([]);

  const generateLogo = async (variant: LogoVariant) => {
    setIsGenerating(true);
    setSelectedVariant(variant);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-logo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ variant }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate logo");
      }

      const data = await response.json();
      
      setGeneratedLogos((prev) => [
        { image: data.image, description: data.description, variant },
        ...prev,
      ]);
      
      toast.success("Logo concept generated!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate logo");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLogo = (imageData: string, variant: string) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `off-the-markets-logo-${variant}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Logo downloaded!");
  };

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Logo Generator</h1>
          <p className="text-muted-foreground">
            Generate AI-powered logo concepts for Off The Markets
          </p>
        </div>

        {/* Variant Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(Object.keys(variantLabels) as LogoVariant[]).map((variant) => (
            <Card
              key={variant}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedVariant === variant && isGenerating
                  ? "border-primary ring-2 ring-primary/20"
                  : ""
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{variantLabels[variant].title}</CardTitle>
                <CardDescription>{variantLabels[variant].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => generateLogo(variant)}
                  disabled={isGenerating}
                  className="w-full"
                  variant={selectedVariant === variant && isGenerating ? "default" : "outline"}
                >
                  {isGenerating && selectedVariant === variant ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generated Logos */}
        {generatedLogos.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Generated Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedLogos.map((logo, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center p-4">
                    <img
                      src={logo.image}
                      alt={`Generated logo - ${logo.variant}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {variantLabels[logo.variant].title}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateLogo(logo.variant)}
                          disabled={isGenerating}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => downloadLogo(logo.image, logo.variant)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    {logo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {logo.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {generatedLogos.length === 0 && !isGenerating && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Click a "Generate" button above to create logo concepts
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
