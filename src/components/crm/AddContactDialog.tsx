import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateCRMContact } from '@/hooks/useCRMContacts';

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SOURCES = [
  { value: 'event', label: 'Event/Networking' },
  { value: 'referral', label: 'Referral' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'website', label: 'Website Inquiry' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'other', label: 'Other' },
];

const STATUSES = [
  { value: 'lead', label: 'Lead' },
  { value: 'active', label: 'Active' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'closed', label: 'Closed' },
  { value: 'not_interested', label: 'Not Interested' },
];

export const AddContactDialog = ({ open, onOpenChange }: AddContactDialogProps) => {
  const createContact = useCreateCRMContact();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    notes: '',
    budget_min: '',
    budget_max: '',
    preferred_locations: '',
    priority_level: 'normal',
    status: 'lead',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createContact.mutateAsync({
      full_name: formData.full_name,
      email: formData.email || null,
      phone: formData.phone || null,
      company: formData.company || null,
      source: formData.source || null,
      notes: formData.notes || null,
      budget_min: formData.budget_min ? parseInt(formData.budget_min) : null,
      budget_max: formData.budget_max ? parseInt(formData.budget_max) : null,
      preferred_locations: formData.preferred_locations 
        ? formData.preferred_locations.split(',').map(l => l.trim()).filter(Boolean)
        : [],
      priority_level: formData.priority_level,
      status: formData.status,
      last_contacted_at: null,
      created_by: null,
    });

    setFormData({
      full_name: '',
      email: '',
      phone: '',
      company: '',
      source: '',
      notes: '',
      budget_min: '',
      budget_max: '',
      preferred_locations: '',
      priority_level: 'normal',
      status: 'lead',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="John Smith"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="07xxx xxx xxx"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Company name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select 
                value={formData.source} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map(source => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority_level} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority_level: value }))}
              >
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget_min">Min Budget (£)</Label>
              <Input
                id="budget_min"
                type="number"
                value={formData.budget_min}
                onChange={(e) => setFormData(prev => ({ ...prev, budget_min: e.target.value }))}
                placeholder="50000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_max">Max Budget (£)</Label>
              <Input
                id="budget_max"
                type="number"
                value={formData.budget_max}
                onChange={(e) => setFormData(prev => ({ ...prev, budget_max: e.target.value }))}
                placeholder="150000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locations">Preferred Locations</Label>
            <Input
              id="locations"
              value={formData.preferred_locations}
              onChange={(e) => setFormData(prev => ({ ...prev, preferred_locations: e.target.value }))}
              placeholder="Bradford, Leeds, Manchester (comma separated)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Cash buyer, interested in social housing deals. No leasehold properties..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createContact.isPending}>
              {createContact.isPending ? 'Adding...' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
