import { useState } from "react";
import { Property } from "@/lib/propertyUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIPropertyAnalysisProps {
  property: Property;
}

interface Analysis {
  summary: string;
  strengths: string[];
  considerations: string[];
  idealInvestor: string;
  strategyScores: {
    btl: number;
    brrr: number;
    hmo: number;
    flip: number;
  };
}

const strategyLabels: Record<string, string> = {
  btl: "Buy-to-Let",
  brrr: "BRRR",
  hmo: "HMO",
  flip: "Flip",
};

export default function AIPropertyAnalysis({ property }: AIPropertyAnalysisProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { toast } = useToast();

  const fetchAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-property`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ property }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 402) {
          throw new Error("AI credits exhausted. Please contact support.");
        }
        throw new Error(errorData.error || "Failed to analyze property");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setHasLoaded(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-muted";
  };

  // Initial state - show button to generate analysis
  if (!hasLoaded && !isLoading && !error) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Sparkles className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">AI Investment Analysis</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get AI-powered insights including strengths, risks, ideal investor profile, 
            and strategy recommendations.
          </p>
          <Button onClick={fetchAnalysis} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            AI Investment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            AI is analyzing this property...
          </p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && !analysis) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analysis Unavailable</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchAnalysis} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Analysis loaded
  if (!analysis) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Investment Analysis
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchAnalysis} 
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Regenerate
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Investment Summary
          </h4>
          <p className="text-foreground">{analysis.summary}</p>
        </div>

        {/* Strengths & Considerations */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Strengths
            </h4>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Considerations
            </h4>
            <ul className="space-y-2">
              {analysis.considerations.map((consideration, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{consideration}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ideal Investor */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Ideal Investor Profile
          </h4>
          <p className="text-foreground">{analysis.idealInvestor}</p>
        </div>

        {/* Strategy Scores */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Strategy Suitability
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(analysis.strategyScores).map(([key, score]) => (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center gap-2 py-1.5 px-3"
              >
                <span>{strategyLabels[key]}</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getScoreColor(score)} transition-all`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8">{score}%</span>
                </div>
              </Badge>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground">
          This AI analysis is for informational purposes only and should not be considered 
          financial advice. Always conduct your own due diligence.
        </p>
      </CardContent>
    </Card>
  );
}
