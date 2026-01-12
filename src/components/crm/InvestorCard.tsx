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
  high: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200',
  normal: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200',
  low: 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-300',
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
    <Card className="hover:shadow-md transition-shadow border-2">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-xl font-bold text-foreground">
                {investor.profile?.full_name || 'Unknown'}
              </h3>
              <Badge 
                variant="secondary" 
                className="text-sm"
              >
                Registered
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-sm cursor-pointer px-3 py-1', PRIORITY_COLORS[investor.priority_level as keyof typeof PRIORITY_COLORS || 'normal'])}
                onClick={handleTogglePriority}
              >
                <Star className="h-4 w-4 mr-1" />
                {investor.priority_level || 'normal'}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-muted-foreground">
              {investor.profile?.email && (
                <span className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {investor.profile.email}
                </span>
              )}
              {investor.profile?.phone && (
                <span className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {investor.profile.phone}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <QuickTagPopover investorId={investor.id} assignedTags={investor.tags} />
            <Button size="lg" variant="outline" className="text-base" onClick={() => onViewDetails(investor)}>
              View Details
            </Button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-4 flex flex-wrap items-center gap-5 text-base">
          <span className="font-semibold text-primary text-lg">
            {formatBudget(investor.min_budget, investor.max_budget)}
          </span>
          
          {investor.preferred_locations?.length > 0 && (
            <span className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              {investor.preferred_locations.slice(0, 2).join(', ')}
              {investor.preferred_locations.length > 2 && ` +${investor.preferred_locations.length - 2}`}
            </span>
          )}

          <span className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            {investor.purchase_timeline.replace(/_/g, ' ')}
          </span>

          {investor.last_contacted_at && (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              Contacted {formatDistanceToNow(new Date(investor.last_contacted_at), { addSuffix: true })}
            </span>
          )}
        </div>

        {/* Tags */}
        {investor.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {investor.tags.slice(0, isExpanded ? undefined : 5).map((tag) => (
              <TagBadge
                key={tag.id}
                tag={tag}
                size="sm"
                onRemove={() => handleRemoveTag(tag.id)}
              />
            ))}
            {!isExpanded && investor.tags.length > 5 && (
              <Badge variant="secondary" className="text-sm cursor-pointer" onClick={() => setIsExpanded(true)}>
                +{investor.tags.length - 5} more
              </Badge>
            )}
          </div>
        )}

        {/* Expandable Details */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-5 w-5" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-5 w-5" />
              Show more details
            </>
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-3 text-base">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground">Funding:</span>{' '}
                <span className="font-medium">{investor.mortgage_approved ? 'Mortgage Approved' : investor.cash_available}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Experience:</span>{' '}
                <span className="font-medium">{investor.investment_experience.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Strategies:</span>{' '}
                <span className="font-medium">{investor.preferred_strategies?.join(', ') || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rental Preference:</span>{' '}
                <span className="font-medium">{investor.rental_preference || 'Not set'}</span>
              </div>
            </div>

            {investor.crm_notes && (
              <div className="p-4 bg-muted/50 rounded-lg text-base">
                <span className="font-semibold">Notes: </span>
                {investor.crm_notes}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <Button size="lg" variant="outline" className="text-base" onClick={handleMarkContacted}>
                <Clock className="h-5 w-5 mr-2" />
                Mark as Contacted
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
