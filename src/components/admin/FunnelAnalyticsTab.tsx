import { ExternalLink, Users, Target, TrendingUp, Footprints, Monitor, Smartphone, Tablet, BarChart3, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useFunnelAnalytics } from '@/hooks/useFunnelAnalytics';
import { formatDistanceToNow } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

interface FunnelData {
  id: string;
  name: string;
  slug: string;
  type: string;
  variant: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
}

function StatCard({ title, value, subtitle, icon: Icon, isLoading }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

function DeviceIcon({ type }: { type: string }) {
  switch (type.toLowerCase()) {
    case 'mobile':
      return <Smartphone className="h-4 w-4" />;
    case 'tablet':
      return <Tablet className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
}

function EmptyState({ funnels }: { funnels: { slug: string; name: string }[] }) {
  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No funnel data yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start driving traffic to your funnels to see analytics here. 
          Use the links below to preview and test your funnels.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {funnels.map((funnel) => (
            <Button key={funnel.slug} variant="outline" size="sm" asChild>
              <a href={`/f/${funnel.slug}`} target="_blank" rel="noopener noreferrer">
                {funnel.name}
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FunnelCard({ funnel }: { funnel: FunnelData }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="font-semibold">{funnel.name}</div>
          <Badge variant="secondary" className="capitalize">
            {funnel.type}
          </Badge>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-semibold">{funnel.sessions}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className="text-lg font-semibold">{funnel.conversions}</div>
            <div className="text-xs text-muted-foreground">Conv.</div>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded">
            <div className={`text-lg font-semibold ${funnel.conversionRate >= 10 ? 'text-green-600' : ''}`}>
              {funnel.conversionRate.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Rate</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline">{funnel.variant}</Badge>
          <Button variant="ghost" size="sm" asChild>
            <a
              href={`/f/${funnel.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MobileFunnelsList({ funnels }: { funnels: FunnelData[] }) {
  return (
    <div className="space-y-3">
      {funnels.map((funnel) => (
        <FunnelCard key={funnel.id} funnel={funnel} />
      ))}
    </div>
  );
}

function MobileLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-14 w-full" />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function FunnelAnalyticsTab() {
  const { data, isLoading, error } = useFunnelAnalytics();
  const isMobile = useIsMobile();

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-destructive">Failed to load funnel analytics</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const hasData = data && data.totalSessions > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Funnel Analytics</h2>
        <p className="text-muted-foreground">Track conversion rates, traffic sources, and drop-off metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sessions"
          value={data?.totalSessions || 0}
          subtitle="Unique visitors"
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Conversions"
          value={data?.totalConversions || 0}
          subtitle="Leads captured"
          icon={Target}
          isLoading={isLoading}
        />
        <StatCard
          title="Conversion Rate"
          value={`${(data?.conversionRate || 0).toFixed(1)}%`}
          subtitle="Sessions → Leads"
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <StatCard
          title="Avg. Steps Completed"
          value={(data?.avgStepsCompleted || 0).toFixed(1)}
          subtitle="Per session"
          icon={Footprints}
          isLoading={isLoading}
        />
      </div>

      {/* Show empty state or full dashboard */}
      {!isLoading && !hasData ? (
        <EmptyState funnels={data?.funnels || []} />
      ) : (
        <>
          {/* Funnel Performance Table / Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Funnel Performance</CardTitle>
              <CardDescription>Click to open any funnel in a new tab</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                isMobile ? (
                  <MobileLoadingSkeleton />
                ) : (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                )
              ) : isMobile ? (
                <MobileFunnelsList funnels={data?.funnels || []} />
              ) : (
                <div className="overflow-x-auto -mx-6">
                  <Table className="min-w-[700px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6 whitespace-nowrap">Funnel</TableHead>
                        <TableHead className="whitespace-nowrap hidden sm:table-cell">Type</TableHead>
                        <TableHead className="whitespace-nowrap hidden md:table-cell">Variant</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Sessions</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Conv.</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Rate</TableHead>
                        <TableHead className="text-right pr-6 whitespace-nowrap">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.funnels.map((funnel) => (
                        <TableRow key={funnel.id}>
                          <TableCell className="font-medium pl-6 whitespace-nowrap">{funnel.name}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="secondary" className="capitalize">
                              {funnel.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">{funnel.variant}</Badge>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">{funnel.sessions}</TableCell>
                          <TableCell className="text-right whitespace-nowrap">{funnel.conversions}</TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <span className={funnel.conversionRate >= 10 ? 'text-green-600 font-medium' : ''}>
                              {funnel.conversionRate.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={`/f/${funnel.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Charts Grid */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : data?.trafficSources && data.trafficSources.length > 0 ? (
                  <ChartContainer
                    config={{
                      sessions: { label: 'Sessions', color: 'hsl(var(--primary))' },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.trafficSources} layout="vertical">
                        <XAxis type="number" />
                        <YAxis dataKey="source" type="category" width={80} tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="sessions" radius={4}>
                          {data.trafficSources.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    No traffic data yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Drop-off Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Step Drop-off</CardTitle>
                <CardDescription>Where visitors leave the funnel</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : data?.stepDropoff && data.stepDropoff.some(s => s.visitors > 0) ? (
                  <div className="space-y-3">
                    {data.stepDropoff.map((step, index) => (
                      <div key={step.step} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{step.stepName}</span>
                          <span className="font-medium">
                            {step.visitors} ({step.percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${step.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    No step data yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Traffic by device type</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : data?.devices && data.devices.length > 0 ? (
                  <div className="space-y-4">
                    {data.devices.map((device) => (
                      <div key={device.type} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-24">
                          <DeviceIcon type={device.type} />
                          <span className="text-sm capitalize">{device.type}</span>
                        </div>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          {device.percentage.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[120px] flex items-center justify-center text-muted-foreground">
                    No device data yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Conversions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversions</CardTitle>
                <CardDescription>Latest leads captured</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : data?.recentConversions && data.recentConversions.length > 0 ? (
                  <div className="space-y-3">
                    {data.recentConversions.slice(0, 5).map((conversion) => (
                      <div
                        key={conversion.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Target className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{conversion.funnelName}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {conversion.conversionType}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(conversion.createdAt), { addSuffix: true })}
                          </p>
                          {conversion.funnelSlug && (
                            <a
                              href={`/f/${conversion.funnelSlug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                            >
                              View <ArrowRight className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[120px] flex items-center justify-center text-muted-foreground">
                    No conversions yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
