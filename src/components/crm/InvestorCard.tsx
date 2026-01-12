import { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Star, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TagBadge } from './TagBadge';
import { QuickTagPopover } from './QuickTagPopover';
import { useRemoveTag } from '@/hooks/useInvestorTags';
import { useUpdateInvestorCRM, type InvestorWithTags } from '@/hooks/useInvestorCRM';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface InvestorCardProps {
  investor: InvestorWithTags;
  onViewDetails: (investor: InvestorWithTags) => void;
}

const PRIORITY_COLORS = {
  high: 'text-red-600 bg-red-50 border-red-200',
  normal: 'text-slate-600 bg-slate-50 border-slate-200',
  low: 'text-gray-500 bg-gray-50 border-gray-200',
};

export const InvestorCard = ({ investor, onViewDetails }: InvestorCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: removeTag } = useRemoveTag();
  const { mutate: updateInvestor } = useUpdateInvestorCRM();

  const handleRemoveTag = (tagId: string) => {
    removeTag({ investorId: investor.id, tagId });
  };

  const handleMarkContacted = () => {
    updateInvestor({ id: investor.id, last_contacted_at: new Date().toISOString() });
  };

  const handleTogglePriority = () => {
    const priorities = ['low', 'normal', 'high'];
    const currentIndex = priorities.indexOf(investor.priority_level || 'normal');
    const nextPriority = priorities[(currentIndex + 1) % priorities.length];
    updateInvestor({ id: investor.id, priority_level: nextPriority });
  };

  const formatBudget = (min: number, max: number) => {
    const formatK = (n: number) => n >= 1000 ? `£${Math.round(n / 1000)}k` : `£${n}`;
    return `${formatK(min)} - ${formatK(max)}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">
                {investor.profile?.full_name || 'Unknown'}
              </h3>
              <Badge
                variant="outline"
                className={cn('text-xs cursor-pointer', PRIORITY_COLORS[investor.priority_level as keyof typeof PRIORITY_COLORS || 'normal'])}
                onClick={handleTogglePriority}
              >
                <Star className="h-3 w-3 mr-1" />
                {investor.priority_level || 'normal'}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {investor.profile?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {investor.profile.email}
                </span>
              )}
              {investor.profile?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {investor.profile.phone}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <QuickTagPopover investorId={investor.id} assignedTags={investor.tags} />
            <Button variant="outline" size="sm" onClick={() => onViewDetails(investor)}>
              View
            </Button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
          <span className="font-medium text-primary">
            {formatBudget(investor.min_budget, investor.max_budget)}
          </span>
          
          {investor.preferred_locations?.length > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {investor.preferred_locations.slice(0, 2).join(', ')}
              {investor.preferred_locations.length > 2 && ` +${investor.preferred_locations.length - 2}`}
            </span>
          )}

          <span className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {investor.purchase_timeline}
          </span>

          {investor.last_contacted_at && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              Contacted {formatDistanceToNow(new Date(investor.last_contacted_at), { addSuffix: true })}
            </span>
          )}
        </div>

        {/* Tags */}
        {investor.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {investor.tags.slice(0, isExpanded ? undefined : 5).map((tag) => (
              <TagBadge
                key={tag.id}
                tag={tag}
                size="sm"
                onRemove={() => handleRemoveTag(tag.id)}
              />
            ))}
            {!isExpanded && investor.tags.length > 5 && (
              <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setIsExpanded(true)}>
                +{investor.tags.length - 5} more
              </Badge>
            )}
          </div>
        )}

        {/* Expandable Details */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Less details
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              More details
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground">Funding:</span>{' '}
                <span className="font-medium">{investor.mortgage_approved ? 'Mortgage Approved' : investor.cash_available}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Experience:</span>{' '}
                <span className="font-medium">{investor.investment_experience}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Strategies:</span>{' '}
                <span className="font-medium">{investor.preferred_strategies?.join(', ') || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rental Pref:</span>{' '}
                <span className="font-medium">{investor.rental_preference || 'Not set'}</span>
              </div>
            </div>

            {investor.crm_notes && (
              <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                <span className="font-medium">Notes: </span>
                {investor.crm_notes}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={handleMarkContacted}>
                <Clock className="h-3 w-3 mr-1" />
                Mark Contacted
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
