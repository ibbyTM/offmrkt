import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        "border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-card",
        isPrimary && "ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center",
          isPrimary 
            ? "bg-primary/10 text-primary" 
            : "bg-muted text-muted-foreground"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
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
