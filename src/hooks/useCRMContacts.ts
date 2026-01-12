import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InvestorTag } from './useInvestorTags';

export interface CRMContact {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  source: string | null;
  notes: string | null;
  budget_min: number | null;
  budget_max: number | null;
  preferred_locations: string[];
  priority_level: string;
  status: string;
  last_contacted_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  tags?: InvestorTag[];
}

export interface CRMContactFilters {
  search?: string;
  tagIds?: string[];
  priorityLevel?: string;
  status?: string;
}

export const useCRMContacts = (filters?: CRMContactFilters) => {
  return useQuery({
    queryKey: ['crm-contacts', filters],
    queryFn: async () => {
      // First fetch contacts
      let query = supabase
        .from('crm_contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      if (filters?.priorityLevel) {
        query = query.eq('priority_level', filters.priorityLevel);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data: contacts, error } = await query;
      if (error) throw error;

      // Fetch tag assignments for all contacts
      const contactIds = contacts.map(c => c.id);
      const { data: tagAssignments, error: tagsError } = await supabase
        .from('investor_tag_assignments')
        .select(`
          crm_contact_id,
          tag:investor_tags(*)
        `)
        .in('crm_contact_id', contactIds);

      if (tagsError) throw tagsError;

      // Map tags to contacts
      const contactsWithTags: CRMContact[] = contacts.map(contact => {
        const contactTags = tagAssignments
          ?.filter(ta => ta.crm_contact_id === contact.id && ta.tag)
          .map(ta => ta.tag as InvestorTag) || [];
        
        return {
          ...contact,
          preferred_locations: contact.preferred_locations || [],
          tags: contactTags,
        };
      });

      // Filter by tags if specified
      if (filters?.tagIds && filters.tagIds.length > 0) {
        return contactsWithTags.filter(contact => 
          contact.tags?.some(tag => filters.tagIds!.includes(tag.id))
        );
      }

      return contactsWithTags;
    },
  });
};

export const useCreateCRMContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contact: Omit<CRMContact, 'id' | 'created_at' | 'updated_at' | 'tags'>) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('crm_contacts')
        .insert({
          ...contact,
          created_by: userData.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast.success('Contact added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add contact: ${error.message}`);
    },
  });
};

export const useUpdateCRMContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CRMContact> & { id: string }) => {
      const { data, error } = await supabase
        .from('crm_contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast.success('Contact updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    },
  });
};

export const useDeleteCRMContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast.success('Contact deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });
};

export const useAssignTagToContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contactId, tagId }: { contactId: string; tagId: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('investor_tag_assignments')
        .insert({ 
          crm_contact_id: contactId, 
          tag_id: tagId,
          assigned_by: userData.user?.id 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast.success('Tag assigned successfully');
    },
    onError: (error: Error) => {
      if (error.message.includes('duplicate')) {
        toast.error('Tag already assigned to this contact');
      } else {
        toast.error(`Failed to assign tag: ${error.message}`);
      }
    },
  });
};

export const useRemoveTagFromContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contactId, tagId }: { contactId: string; tagId: string }) => {
      const { error } = await supabase
        .from('investor_tag_assignments')
        .delete()
        .eq('crm_contact_id', contactId)
        .eq('tag_id', tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast.success('Tag removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove tag: ${error.message}`);
    },
  });
};
