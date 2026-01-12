import { useState } from 'react';
import { Users, UserCheck, AlertCircle, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { InvestorFilters } from './InvestorFilters';
import { InvestorCard } from './InvestorCard';
import { ContactCard } from './ContactCard';
import { TagManager } from './TagManager';
import { InvestorDetailDrawer } from './InvestorDetailDrawer';
import { ContactDetailDrawer } from './ContactDetailDrawer';
import { AddContactDialog } from './AddContactDialog';
import { useInvestorCRM, type CRMFilters, type InvestorWithTags } from '@/hooks/useInvestorCRM';
import { useCRMContacts, type CRMContact, type CRMContactFilters } from '@/hooks/useCRMContacts';

type ViewTab = 'registered' | 'manual' | 'all';

export const InvestorCRMTab = () => {
  const [filters, setFilters] = useState<CRMFilters>({});
  const [viewTab, setViewTab] = useState<ViewTab>('registered');
  const [statusTab, setStatusTab] = useState<'approved' | 'pending' | 'all'>('approved');
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorWithTags | null>(null);
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);

  // Filters for registered investors
  const effectiveFilters: CRMFilters = {
    ...filters,
    status: statusTab === 'all' ? undefined : statusTab === 'pending' ? 'pending' : 'approved',
  };

  // Filters for manual contacts
  const contactFilters: CRMContactFilters = {
    search: filters.search,
    tagIds: filters.tagIds,
    priorityLevel: filters.priorityLevel,
  };

  const { data: investors, isLoading: investorsLoading, error: investorsError } = useInvestorCRM(effectiveFilters);
  const { data: contacts, isLoading: contactsLoading, error: contactsError } = useCRMContacts(contactFilters);

  const isLoading = investorsLoading || contactsLoading;
  const error = investorsError || contactsError;

  const approvedCount = investors?.filter(i => i.status === 'approved').length || 0;
  const pendingCount = investors?.filter(i => i.status === 'pending').length || 0;
  const manualCount = contacts?.length || 0;
  const highPriorityCount = (investors?.filter(i => i.priority_level === 'high').length || 0) +
    (contacts?.filter(c => c.priority_level === 'high').length || 0);

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

  const renderInvestorsList = () => {
    if (investorsLoading) {
      return (
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
      );
    }

    if (investors && investors.length > 0) {
      return (
        <div className="space-y-3">
          {investors.map((investor) => (
            <InvestorCard
              key={investor.id}
              investor={investor}
              onViewDetails={setSelectedInvestor}
            />
          ))}
        </div>
      );
    }

    return (
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
    );
  };

  const renderContactsList = () => {
    if (contactsLoading) {
      return (
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
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (contacts && contacts.length > 0) {
      return (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onViewDetails={setSelectedContact}
            />
          ))}
        </div>
      );
    }

    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No contacts found</p>
          <p className="text-muted-foreground text-sm">
            Add manual contacts to track investors without accounts
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setShowAddContact(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Investor CRM</h2>
          <p className="text-muted-foreground text-sm">
            Manage and segment your investors with custom tags
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddContact(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            New Contact
          </Button>
          <TagManager />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
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
            <div className="p-2 rounded-lg bg-purple-500/10">
              <UserPlus className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{isLoading ? '-' : manualCount}</p>
              <p className="text-xs text-muted-foreground">Manual</p>
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
              <p className="text-2xl font-bold">{isLoading ? '-' : (investors?.length || 0) + manualCount}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs: Registered vs Manual */}
      <Tabs value={viewTab} onValueChange={(v) => setViewTab(v as ViewTab)}>
        <TabsList>
          <TabsTrigger value="registered" className="gap-2">
            Registered Investors
            <Badge variant="secondary" className="h-5 px-1.5">
              {isLoading ? '-' : investors?.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2">
            Manual Contacts
            <Badge variant="secondary" className="h-5 px-1.5">
              {isLoading ? '-' : manualCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="registered" className="mt-4 space-y-4">
          {/* Status Sub-Tabs for Registered */}
          <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)}>
            <TabsList>
              <TabsTrigger value="approved" className="gap-2">
                Approved
                <Badge variant="secondary" className="h-5 px-1.5">{approvedCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                Pending
                <Badge variant="secondary" className="h-5 px-1.5">{pendingCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="all">All Registered</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filters */}
          <InvestorFilters filters={filters} onFiltersChange={setFilters} />

          {/* Investors List */}
          {renderInvestorsList()}
        </TabsContent>

        <TabsContent value="manual" className="mt-4 space-y-4">
          {/* Filters */}
          <InvestorFilters filters={filters} onFiltersChange={setFilters} />

          {/* Contacts List */}
          {renderContactsList()}
        </TabsContent>

        <TabsContent value="all" className="mt-4 space-y-4">
          {/* Filters */}
          <InvestorFilters filters={filters} onFiltersChange={setFilters} />

          {/* Combined List */}
          <div className="space-y-3">
            {!isLoading && (
              <>
                {investors?.map((investor) => (
                  <InvestorCard
                    key={investor.id}
                    investor={investor}
                    onViewDetails={setSelectedInvestor}
                  />
                ))}
                {contacts?.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onViewDetails={setSelectedContact}
                  />
                ))}
              </>
            )}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {!isLoading && (!investors?.length && !contacts?.length) && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No investors found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Drawers */}
      <InvestorDetailDrawer
        investor={selectedInvestor}
        onClose={() => setSelectedInvestor(null)}
      />
      <ContactDetailDrawer
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
      />

      {/* Add Contact Dialog */}
      <AddContactDialog
        open={showAddContact}
        onOpenChange={setShowAddContact}
      />
    </div>
  );
};
