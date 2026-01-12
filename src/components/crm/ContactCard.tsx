import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Mail, Phone, Building2, MapPin, Calendar, Star, StarOff } from 'lucide-react';
import { CRMContact, useUpdateCRMContact, useRemoveTagFromContact } from '@/hooks/useCRMContacts';
import { TagBadge } from './TagBadge';
import { ContactQuickTagPopover } from './ContactQuickTagPopover';
import { formatDistanceToNow } from 'date-fns';

interface ContactCardProps {
  contact: CRMContact;
  onViewDetails: (contact: CRMContact) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200',
  normal: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200',
  low: 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-300',
};

const STATUS_COLORS: Record<string, string> = {
  lead: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  negotiating: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  closed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  not_interested: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
};

export const ContactCard = ({ contact, onViewDetails }: ContactCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const removeTag = useRemoveTagFromContact();
  const updateContact = useUpdateCRMContact();

  const handleRemoveTag = (tagId: string) => {
    removeTag.mutate({ contactId: contact.id, tagId });
  };

  const handleTogglePriority = () => {
    const newPriority = contact.priority_level === 'high' ? 'normal' : 'high';
    updateContact.mutate({ id: contact.id, priority_level: newPriority });
  };

  const handleMarkContacted = () => {
    updateContact.mutate({ id: contact.id, last_contacted_at: new Date().toISOString() });
  };

  const formatBudget = () => {
    if (!contact.budget_min && !contact.budget_max) return null;
    if (contact.budget_min && contact.budget_max) {
      return `£${(contact.budget_min / 1000).toFixed(0)}k - £${(contact.budget_max / 1000).toFixed(0)}k`;
    }
    if (contact.budget_max) return `Up to £${(contact.budget_max / 1000).toFixed(0)}k`;
    return `From £${(contact.budget_min! / 1000).toFixed(0)}k`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-2">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h3 className="text-xl font-bold">{contact.full_name}</h3>
              <Badge variant="outline" className="text-sm bg-amber-50 text-amber-700 border-amber-300 px-3 py-1">
                Manual
              </Badge>
              <Badge className={`text-sm px-3 py-1 ${STATUS_COLORS[contact.status] || STATUS_COLORS.lead}`}>
                {contact.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge
                variant="outline"
                className={`text-sm cursor-pointer px-3 py-1 ${PRIORITY_COLORS[contact.priority_level] || PRIORITY_COLORS.normal}`}
                onClick={handleTogglePriority}
              >
                {contact.priority_level === 'high' ? (
                  <StarOff className="h-4 w-4 mr-1" />
                ) : (
                  <Star className="h-4 w-4 mr-1" />
                )}
                {contact.priority_level}
              </Badge>
            </div>
            
            <div className="flex items-center gap-5 mt-3 text-base text-muted-foreground flex-wrap">
              {contact.email && (
                <span className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {contact.email}
                </span>
              )}
              {contact.phone && (
                <span className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {contact.phone}
                </span>
              )}
              {contact.company && (
                <span className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {contact.company}
                </span>
              )}
            </div>

            <div className="flex items-center gap-5 mt-3 text-base">
              {formatBudget() && (
                <span className="font-semibold text-primary text-lg">
                  Budget: {formatBudget()}
                </span>
              )}
              {contact.preferred_locations && contact.preferred_locations.length > 0 && (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  {contact.preferred_locations.join(', ')}
                </span>
              )}
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {contact.tags.map(tag => (
                  <TagBadge
                    key={tag.id}
                    tag={tag}
                    onRemove={() => handleRemoveTag(tag.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <ContactQuickTagPopover
              contactId={contact.id}
              assignedTags={contact.tags || []}
            />
            <Button size="lg" variant="outline" className="text-base" onClick={() => onViewDetails(contact)}>
              View Details
            </Button>
          </div>
        </div>

        {/* Expandable section */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Button size="lg" variant="ghost" className="text-base" onClick={handleMarkContacted}>
              <Calendar className="h-5 w-5 mr-2" />
              Mark as Contacted
            </Button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-base text-muted-foreground hover:text-foreground"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="h-5 w-5" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="h-5 w-5" />
                </>
              )}
            </button>
          </div>

          {expanded && (
            <div className="mt-4 space-y-4 text-base">
              {contact.source && (
                <div>
                  <span className="font-semibold">Source: </span>
                  <span className="text-muted-foreground capitalize">{contact.source.replace('_', ' ')}</span>
                </div>
              )}
              {contact.notes && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <span className="font-semibold">Notes:</span>
                  <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{contact.notes}</p>
                </div>
              )}
              {contact.last_contacted_at && (
                <div className="text-muted-foreground">
                  Last contacted: {formatDistanceToNow(new Date(contact.last_contacted_at), { addSuffix: true })}
                </div>
              )}
              <div className="text-muted-foreground">
                Added: {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
