import { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Clock, Star, Save } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TagBadge } from './TagBadge';
import { QuickTagPopover } from './QuickTagPopover';
import { useRemoveTag } from '@/hooks/useInvestorTags';
import { useUpdateInvestorCRM, type InvestorWithTags } from '@/hooks/useInvestorCRM';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface InvestorDetailDrawerProps {
  investor: InvestorWithTags | null;
  onClose: () => void;
}

const PRIORITY_COLORS = {
  high: 'text-red-600 bg-red-50 border-red-200',
  normal: 'text-slate-600 bg-slate-50 border-slate-200',
  low: 'text-gray-500 bg-gray-50 border-gray-200',
};

export const InvestorDetailDrawer = ({ investor, onClose }: InvestorDetailDrawerProps) => {
  const [crmNotes, setCrmNotes] = useState(investor?.crm_notes || '');
  const [priorityLevel, setPriorityLevel] = useState(investor?.priority_level || 'normal');
  const [rentalPreference, setRentalPreference] = useState(investor?.rental_preference || '');
  const [hasChanges, setHasChanges] = useState(false);

  const { mutate: removeTag } = useRemoveTag();
  const { mutate: updateInvestor, isPending } = useUpdateInvestorCRM();

  if (!investor) return null;

  const handleSave = () => {
    updateInvestor({
      id: investor.id,
      crm_notes: crmNotes,
      priority_level: priorityLevel,
      rental_preference: rentalPreference,
    }, {
      onSuccess: () => setHasChanges(false),
    });
  };

  const handleMarkContacted = () => {
    updateInvestor({ id: investor.id, last_contacted_at: new Date().toISOString() });
  };

  const handleChange = (field: 'notes' | 'priority' | 'rental', value: string) => {
    setHasChanges(true);
    if (field === 'notes') setCrmNotes(value);
    if (field === 'priority') setPriorityLevel(value);
    if (field === 'rental') setRentalPreference(value);
  };

  const formatBudget = (n: number) => {
    return n >= 1000 ? `£${Math.round(n / 1000).toLocaleString()}k` : `£${n.toLocaleString()}`;
  };

  return (
    <Sheet open={!!investor} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {investor.profile?.full_name || 'Unknown Investor'}
            <Badge
              variant="outline"
              className={cn('text-xs', PRIORITY_COLORS[priorityLevel as keyof typeof PRIORITY_COLORS])}
            >
              <Star className="h-3 w-3 mr-1" />
              {priorityLevel}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Contact Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Contact</h4>
            <div className="space-y-1">
              {investor.profile?.email && (
                <a
                  href={`mailto:${investor.profile.email}`}
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {investor.profile.email}
                </a>
              )}
              {investor.profile?.phone && (
                <a
                  href={`tel:${investor.profile.phone}`}
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {investor.profile.phone}
                </a>
              )}
            </div>
          </div>

          <Separator />

          {/* Investment Profile */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Investment Profile</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Budget:</span>
                <p className="font-medium">
                  {formatBudget(investor.min_budget)} - {formatBudget(investor.max_budget)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Funding:</span>
                <p className="font-medium">
                  {investor.mortgage_approved ? 'Mortgage Approved' : investor.cash_available}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Experience:</span>
                <p className="font-medium">{investor.investment_experience}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Timeline:</span>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {investor.purchase_timeline}
                </p>
              </div>
            </div>

            {investor.preferred_locations?.length > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">Preferred Locations:</span>
                <p className="font-medium text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {investor.preferred_locations.join(', ')}
                </p>
              </div>
            )}

            {investor.preferred_strategies?.length > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">Strategies:</span>
                <p className="font-medium text-sm">{investor.preferred_strategies.join(', ')}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground">Tags</h4>
              <QuickTagPopover investorId={investor.id} assignedTags={investor.tags} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {investor.tags.length > 0 ? (
                investor.tags.map((tag) => (
                  <TagBadge
                    key={tag.id}
                    tag={tag}
                    onRemove={() => removeTag({ investorId: investor.id, tagId: tag.id })}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tags assigned</p>
              )}
            </div>
          </div>

          <Separator />

          {/* CRM Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">CRM Settings</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select
                  value={priorityLevel}
                  onValueChange={(v) => handleChange('priority', v)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rental">Rental Preference</Label>
                <Select
                  value={rentalPreference}
                  onValueChange={(v) => handleChange('rental', v)}
                >
                  <SelectTrigger id="rental">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social Housing</SelectItem>
                    <SelectItem value="private">Private Rental</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">CRM Notes</Label>
              <Textarea
                id="notes"
                value={crmNotes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Add private notes about this investor..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>

          <Separator />

          {/* Activity */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Activity</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Registered:</span>{' '}
                {format(new Date(investor.created_at), 'dd MMM yyyy')}
              </p>
              {investor.last_contacted_at && (
                <p className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Last contacted:</span>{' '}
                  {formatDistanceToNow(new Date(investor.last_contacted_at), { addSuffix: true })}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={!hasChanges || isPending} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleMarkContacted}>
              <Clock className="h-4 w-4 mr-2" />
              Mark Contacted
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
