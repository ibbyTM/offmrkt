import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Mail, Phone, Building2, MapPin, Calendar, X, Star, StarOff } from 'lucide-react';
import { CRMContact, useUpdateCRMContact, useRemoveTagFromContact } from '@/hooks/useCRMContacts';
import { TagBadge } from './TagBadge';
import { ContactQuickTagPopover } from './ContactQuickTagPopover';
import { formatDistanceToNow } from 'date-fns';

interface ContactCardProps {
  contact: CRMContact;
  onViewDetails: (contact: CRMContact) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  normal: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg truncate">{contact.full_name}</h3>
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                MANUAL
              </Badge>
              <Badge className={STATUS_COLORS[contact.status] || STATUS_COLORS.lead}>
                {contact.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
              {contact.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {contact.email}
                </span>
              )}
              {contact.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {contact.phone}
                </span>
              )}
              {contact.company && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {contact.company}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm">
              {formatBudget() && (
                <span className="font-medium text-primary">
                  Budget: {formatBudget()}
                </span>
              )}
              {contact.preferred_locations?.length > 0 && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {contact.preferred_locations.join(', ')}
                </span>
              )}
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
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

          <div className="flex flex-col items-end gap-2">
            <Badge className={PRIORITY_COLORS[contact.priority_level] || PRIORITY_COLORS.normal}>
              {contact.priority_level.toUpperCase()}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleTogglePriority}
                title={contact.priority_level === 'high' ? 'Remove priority' : 'Mark as high priority'}
              >
                {contact.priority_level === 'high' ? (
                  <StarOff className="h-4 w-4" />
                ) : (
                  <Star className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Expandable section */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ContactQuickTagPopover
                contactId={contact.id}
                assignedTags={contact.tags || []}
              />
              <Button variant="outline" size="sm" onClick={() => onViewDetails(contact)}>
                View Details
              </Button>
              <Button variant="ghost" size="sm" onClick={handleMarkContacted}>
                <Calendar className="h-3 w-3 mr-1" />
                Mark Contacted
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  Less <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  More <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          {expanded && (
            <div className="mt-4 space-y-3">
              {contact.source && (
                <div>
                  <span className="text-sm font-medium">Source: </span>
                  <span className="text-sm text-muted-foreground capitalize">{contact.source.replace('_', ' ')}</span>
                </div>
              )}
              {contact.notes && (
                <div>
                  <span className="text-sm font-medium">Notes:</span>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{contact.notes}</p>
                </div>
              )}
              {contact.last_contacted_at && (
                <div className="text-sm text-muted-foreground">
                  Last contacted: {formatDistanceToNow(new Date(contact.last_contacted_at), { addSuffix: true })}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Added: {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
