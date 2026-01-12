import { useState } from 'react';
import { Users, UserCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { InvestorFilters } from './InvestorFilters';
import { InvestorCard } from './InvestorCard';
import { TagManager } from './TagManager';
import { InvestorDetailDrawer } from './InvestorDetailDrawer';
import { useInvestorCRM, type CRMFilters, type InvestorWithTags } from '@/hooks/useInvestorCRM';

export const InvestorCRMTab = () => {
  const [filters, setFilters] = useState<CRMFilters>({});
  const [statusTab, setStatusTab] = useState<'approved' | 'pending' | 'all'>('approved');
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorWithTags | null>(null);

  // Modify filters based on status tab
  const effectiveFilters: CRMFilters = {
    ...filters,
    status: statusTab === 'all' ? undefined : statusTab === 'pending' ? 'pending' : 'approved',
  };

  const { data: investors, isLoading, error } = useInvestorCRM(effectiveFilters);

  const approvedCount = investors?.filter(i => i.status === 'approved').length || 0;
  const pendingCount = investors?.filter(i => i.status === 'pending').length || 0;
  const highPriorityCount = investors?.filter(i => i.priority_level === 'high').length || 0;

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-medium">Failed to load investors</p>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Investor CRM</h2>
          <p className="text-muted-foreground text-sm">
            Manage and segment your approved investors with custom tags
          </p>
        </div>
        <TagManager />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{isLoading ? '-' : approvedCount}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Users className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{isLoading ? '-' : pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{isLoading ? '-' : highPriorityCount}</p>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{isLoading ? '-' : investors?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total Shown</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)}>
        <TabsList>
          <TabsTrigger value="approved" className="gap-2">
            Approved
            <Badge variant="secondary" className="h-5 px-1.5">
              {isLoading ? '-' : approvedCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            <Badge variant="secondary" className="h-5 px-1.5">
              {isLoading ? '-' : pendingCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={statusTab} className="mt-4 space-y-4">
          {/* Filters */}
          <InvestorFilters filters={filters} onFiltersChange={setFilters} />

          {/* Investors List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : investors && investors.length > 0 ? (
            <div className="space-y-3">
              {investors.map((investor) => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  onViewDetails={setSelectedInvestor}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No investors found</p>
                <p className="text-muted-foreground text-sm">
                  {filters.search || filters.tagIds?.length
                    ? 'Try adjusting your filters'
                    : 'Approved investors will appear here'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Drawer */}
      <InvestorDetailDrawer
        investor={selectedInvestor}
        onClose={() => setSelectedInvestor(null)}
      />
    </div>
  );
};
