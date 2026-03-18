import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: ReactNode;
  isPrimary?: boolean;
}

export function StatCard({ title, value, subtitle, icon, isPrimary = false }: StatCardProps) {
  return (
    <Card 
      className={cn(
        "shadow-sm hover:shadow-md transition-all duration-300 bg-card",
        isPrimary && "border-l-4 border-l-primary"
      )}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="shrink-0">{icon}</span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className={cn(
          "text-3xl font-bold tracking-tight",
          isPrimary ? "text-primary" : "text-foreground"
        )}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
