import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  TrendingUp, 
  PoundSterling, 
  BarChart3,
  ChevronRight,
  MapPin,
  Bed
} from "lucide-react";

const mockProperties = [
  { 
    title: "Victorian Terrace", 
    location: "Manchester", 
    price: "£185,000", 
    yield: "8.2%",
    beds: 3
  },
  { 
    title: "Modern Flat", 
    location: "Liverpool", 
    price: "£125,000", 
    yield: "7.8%",
    beds: 2
  },
  { 
    title: "Semi-Detached", 
    location: "Leeds", 
    price: "£210,000", 
    yield: "7.5%",
    beds: 4
  },
];

export function DashboardPreview() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="relative py-16 md:py-24 overflow-hidden">
      {/* Glow effect behind dashboard */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div 
          className={cn(
            "mx-auto max-w-5xl transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          {/* Dashboard frame */}
          <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10">
            {/* Top bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-secondary text-xs text-muted-foreground">
                  investorhub.app/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="flex">
              {/* Sidebar */}
              <div className="hidden md:block w-56 border-r border-border bg-background/30 p-4">
                <div className="space-y-1">
                  {[
                    { icon: Home, label: "Dashboard", active: true },
                    { icon: BarChart3, label: "Properties", active: false },
                    { icon: TrendingUp, label: "Analytics", active: false },
                    { icon: PoundSterling, label: "Finances", active: false },
                  ].map((item) => (
                    <div 
                      key={item.label}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                        item.active 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-6">
                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Portfolio Value", value: "£450,000" },
                    { label: "Monthly Income", value: "£3,240" },
                    { label: "Avg. Yield", value: "8.1%" },
                    { label: "Properties", value: "4" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                      <div className="text-lg font-bold text-foreground">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Properties list */}
                <div className="rounded-xl border border-border bg-background/50">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">Available Deals</h3>
                    <span className="text-xs text-primary flex items-center gap-1 cursor-pointer hover:underline">
                      View all <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {mockProperties.map((property) => (
                      <div key={property.title} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Home className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{property.title}</div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {property.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Bed className="h-3 w-3" />
                                {property.beds} bed
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">{property.price}</div>
                          <div className="text-xs text-primary font-medium">{property.yield} yield</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
