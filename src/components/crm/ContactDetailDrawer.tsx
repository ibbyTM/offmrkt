import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Building2, MapPin, Calendar, Trash2 } from 'lucide-react';
import { CRMContact, useUpdateCRMContact, useDeleteCRMContact, useRemoveTagFromContact } from '@/hooks/useCRMContacts';
import { TagBadge } from './TagBadge';
import { ContactQuickTagPopover } from './ContactQuickTagPopover';
import { formatDistanceToNow, format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ContactDetailDrawerProps {
  contact: CRMContact | null;
  onClose: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  normal: 'bg-gray-100 text-gray-800',
  low: 'bg-blue-100 text-blue-800',
};

const STATUSES = [
  { value: 'lead', label: 'Lead' },
  { value: 'active', label: 'Active' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'closed', label: 'Closed' },
  { value: 'not_interested', label: 'Not Interested' },
];

export const ContactDetailDrawer = ({ contact, onClose }: ContactDetailDrawerProps) => {
  const [notes, setNotes] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('normal');
  const [status, setStatus] = useState('lead');
  const [hasChanges, setHasChanges] = useState(false);

  const removeTag = useRemoveTagFromContact();
  const updateContact = useUpdateCRMContact();
  const deleteContact = useDeleteCRMContact();

  useEffect(() => {
    if (contact) {
      setNotes(contact.notes || '');
      setPriorityLevel(contact.priority_level || 'normal');
      setStatus(contact.status || 'lead');
      setHasChanges(false);
    }
  }, [contact]);

  if (!contact) return null;

  const handleSave = () => {
    updateContact.mutate({
      id: contact.id,
      notes,
      priority_level: priorityLevel,
      status,
    });
    setHasChanges(false);
  };

  const handleMarkContacted = () => {
    updateContact.mutate({
      id: contact.id,
      last_contacted_at: new Date().toISOString(),
    });
  };

  const handleDelete = () => {
    deleteContact.mutate(contact.id);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setHasChanges(true);
    if (field === 'notes') setNotes(value);
    if (field === 'priority_level') setPriorityLevel(value);
    if (field === 'status') setStatus(value);
  };

  const formatBudget = () => {
    if (!contact.budget_min && !contact.budget_max) return 'Not specified';
    if (contact.budget_min && contact.budget_max) {
      return `£${contact.budget_min.toLocaleString()} - £${contact.budget_max.toLocaleString()}`;
    }
    if (contact.budget_max) return `Up to £${contact.budget_max.toLocaleString()}`;
    return `From £${contact.budget_min!.toLocaleString()}`;
  };

  return (
    <Sheet open={!!contact} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              {contact.full_name}
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                MANUAL
              </Badge>
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h4 className="font-medium mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm">
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {contact.company}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Investment Profile */}
            <div>
              <h4 className="font-medium mb-3">Investment Profile</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">{formatBudget()}</span>
                </div>
                {contact.source && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source:</span>
                    <span className="capitalize">{contact.source.replace('_', ' ')}</span>
                  </div>
                )}
                {contact.preferred_locations && contact.preferred_locations.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Locations:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {contact.preferred_locations.map((loc, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {loc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Tags</h4>
                <ContactQuickTagPopover
                  contactId={contact.id}
                  assignedTags={contact.tags || []}
                />
              </div>
              {contact.tags && contact.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {contact.tags.map(tag => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      onRemove={() => removeTag.mutate({ contactId: contact.id, tagId: tag.id })}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tags assigned</p>
              )}
            </div>

            <Separator />

            {/* CRM Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">CRM Settings</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select value={priorityLevel} onValueChange={(v) => handleChange('priority_level', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => handleChange('status', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Add internal notes..."
                  rows={4}
                />
              </div>
            </div>

            <Separator />

            {/* Activity */}
            <div>
              <h4 className="font-medium mb-3">Activity</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Added:</span>
                  <span>{format(new Date(contact.created_at), 'dd MMM yyyy')}</span>
                </div>
                {contact.last_contacted_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Contacted:</span>
                    <span>{formatDistanceToNow(new Date(contact.last_contacted_at), { addSuffix: true })}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSave} 
                disabled={!hasChanges || updateContact.isPending}
                className="flex-1"
              >
                {updateContact.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={handleMarkContacted}>
                <Calendar className="h-4 w-4 mr-1" />
                Contacted
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {contact.full_name}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
