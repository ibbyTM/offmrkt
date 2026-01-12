import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { InvestorTag, TagCategory } from './useInvestorTags';

export interface InvestorWithTags {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  min_budget: number;
  max_budget: number;
  cash_available: string;
  mortgage_approved: boolean;
  preferred_locations: string[];
  preferred_strategies: string[];
  investment_experience: string;
  purchase_timeline: string;
  specific_locations: string[] | null;
  tenure_preferences: string[] | null;
  rental_preference: string | null;
  crm_notes: string | null;
  priority_level: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
  profile: {
    full_name: string;
    email: string;
    phone: string | null;
  } | null;
  tags: InvestorTag[];
}

export interface CRMFilters {
  search?: string;
  tagIds?: string[];
  categories?: TagCategory[];
  priorityLevel?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export const useInvestorCRM = (filters?: CRMFilters) => {
  return useQuery({
    queryKey: ['investor-crm', filters],
    queryFn: async () => {
      // Fetch investors with profiles
      let query = supabase
        .from('investor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter (default to approved for CRM)
      if (filters?.status) {
        query = query.eq('status', filters.status);
      } else {
        query = query.eq('status', 'approved');
      }

      // Apply priority filter
      if (filters?.priorityLevel) {
        query = query.eq('priority_level', filters.priorityLevel);
      }

      const { data: investors, error: investorsError } = await query;

      if (investorsError) throw investorsError;

      if (!investors || investors.length === 0) {
        return [];
      }

      // Fetch profiles for all investors
      const userIds = investors.map(inv => inv.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, phone')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Fetch tag assignments for all investors
      const investorIds = investors.map(inv => inv.id);
      const { data: assignments, error: assignmentsError } = await supabase
        .from('investor_tag_assignments')
        .select('investor_id, tag_id')
        .in('investor_id', investorIds);

      if (assignmentsError) throw assignmentsError;

      // Fetch all tags
      const { data: tags, error: tagsError } = await supabase
        .from('investor_tags')
        .select('*');

      if (tagsError) throw tagsError;

      // Map tags by ID for quick lookup
      const tagMap = new Map(tags?.map(tag => [tag.id, tag]) || []);
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      // Combine data
      let result: InvestorWithTags[] = investors.map(investor => {
        const investorAssignments = assignments?.filter(a => a.investor_id === investor.id) || [];
        const investorTags = investorAssignments
          .map(a => tagMap.get(a.tag_id))
          .filter(Boolean) as InvestorTag[];

        return {
          ...investor,
          profile: profileMap.get(investor.user_id) || null,
          tags: investorTags,
        };
      });

      // Apply search filter
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(inv => 
          inv.profile?.full_name?.toLowerCase().includes(searchLower) ||
          inv.profile?.email?.toLowerCase().includes(searchLower) ||
          inv.preferred_locations?.some(loc => loc.toLowerCase().includes(searchLower)) ||
          inv.specific_locations?.some(loc => loc.toLowerCase().includes(searchLower))
        );
      }

      // Apply tag filter
      if (filters?.tagIds && filters.tagIds.length > 0) {
        result = result.filter(inv => 
          filters.tagIds!.some(tagId => inv.tags.some(t => t.id === tagId))
        );
      }

      // Apply category filter
      if (filters?.categories && filters.categories.length > 0) {
        result = result.filter(inv =>
          inv.tags.some(tag => filters.categories!.includes(tag.category))
        );
      }

      return result;
    },
  });
};

export const useUpdateInvestorCRM = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      crm_notes, 
      priority_level, 
      specific_locations, 
      tenure_preferences, 
      rental_preference,
      last_contacted_at 
    }: { 
      id: string; 
      crm_notes?: string | null;
      priority_level?: string;
      specific_locations?: string[];
      tenure_preferences?: string[];
      rental_preference?: string;
      last_contacted_at?: string | null;
    }) => {
      const updates: Record<string, unknown> = {};
      
      if (crm_notes !== undefined) updates.crm_notes = crm_notes;
      if (priority_level !== undefined) updates.priority_level = priority_level;
      if (specific_locations !== undefined) updates.specific_locations = specific_locations;
      if (tenure_preferences !== undefined) updates.tenure_preferences = tenure_preferences;
      if (rental_preference !== undefined) updates.rental_preference = rental_preference;
      if (last_contacted_at !== undefined) updates.last_contacted_at = last_contacted_at;

      const { data, error } = await supabase
        .from('investor_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-crm'] });
      toast.success('Investor updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update investor: ${error.message}`);
    },
  });
};
