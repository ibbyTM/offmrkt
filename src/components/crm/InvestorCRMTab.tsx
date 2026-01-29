import { useState } from 'react';
import { Users, UserPlus, AlertCircle, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvestorCard } from './InvestorCard';
import { ContactCard } from './ContactCard';
import { TagManager } from './TagManager';
import { InvestorDetailDrawer } from './InvestorDetailDrawer';
import { ContactDetailDrawer } from './ContactDetailDrawer';
import { AddContactDialog } from './AddContactDialog';
import { useInvestorCRM, type CRMFilters, type InvestorWithTags } from '@/hooks/useInvestorCRM';
import { useCRMContacts, type CRMContact, type CRMContactFilters } from '@/hooks/useCRMContacts';

export const InvestorCRMTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorWithTags | null>(null);
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);

  // Filters for registered investors
  const investorFilters: CRMFilters = {
    search: searchQuery || undefined,
    priorityLevel: priorityFilter !== 'all' ? priorityFilter : undefined,
  };

  // Filters for manual contacts
  const contactFilters: CRMContactFilters = {
    search: searchQuery || undefined,
    priorityLevel: priorityFilter !== 'all' ? priorityFilter : undefined,
  };

  const { data: investors, isLoading: investorsLoading, error: investorsError } = useInvestorCRM(investorFilters);
  const { data: contacts, isLoading: contactsLoading, error: contactsError } = useCRMContacts(contactFilters);

  const isLoading = investorsLoading || contactsLoading;
  const error = investorsError || contactsError;

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <p className="text-xl font-medium">Failed to load investors</p>
            <p className="text-lg text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Combine all entries for a simple unified list
  const allEntries = [
    ...(investors?.map(i => ({ type: 'investor' as const, data: i })) || []),
    ...(contacts?.map(c => ({ type: 'contact' as const, data: c })) || []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-base sm:text-lg text-muted-foreground">
            {isLoading ? 'Loading...' : `${allEntries.length} total contacts`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button size="lg" onClick={() => setShowAddContact(true)} className="text-base w-full sm:w-auto">
            <UserPlus className="h-5 w-5 mr-2" />
            Add New Contact
          </Button>
          <TagManager />
        </div>
      </div>

      {/* Simple Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-12 text-base">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-base">All Priorities</SelectItem>
                <SelectItem value="high" className="text-base">🔴 High Priority</SelectItem>
                <SelectItem value="normal" className="text-base">🟡 Normal</SelectItem>
                <SelectItem value="low" className="text-base">🟢 Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Combined List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-5 w-56" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-12 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : allEntries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-20 w-20 text-muted-foreground mb-6" />
            <p className="text-2xl font-semibold mb-2">No contacts found</p>
            <p className="text-lg text-muted-foreground mb-6">
              {searchQuery ? 'Try a different search term' : 'Add your first contact to get started'}
            </p>
            <Button size="lg" onClick={() => setShowAddContact(true)} className="text-base">
              <UserPlus className="h-5 w-5 mr-2" />
              Add Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {allEntries.map((entry) => 
            entry.type === 'investor' ? (
              <InvestorCard
                key={entry.data.id}
                investor={entry.data}
                onViewDetails={setSelectedInvestor}
              />
            ) : (
              <ContactCard
                key={entry.data.id}
                contact={entry.data}
                onViewDetails={setSelectedContact}
              />
            )
          )}
        </div>
      )}

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
