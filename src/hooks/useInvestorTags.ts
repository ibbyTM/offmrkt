import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type TagCategory = 'funding_type' | 'strategy' | 'rental_type' | 'location' | 'budget' | 'preference';

export interface InvestorTag {
  id: string;
  name: string;
  category: TagCategory;
  color: string;
  created_at: string;
}

export interface TagAssignment {
  id: string;
  investor_id: string;
  tag_id: string;
  assigned_by: string | null;
  assigned_at: string;
  tag?: InvestorTag;
}

export const useInvestorTags = () => {
  return useQuery({
    queryKey: ['investor-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investor_tags')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as InvestorTag[];
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, category, color }: { name: string; category: TagCategory; color: string }) => {
      const { data, error } = await supabase
        .from('investor_tags')
        .insert({ name: name.toUpperCase(), category, color })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-tags'] });
      toast.success('Tag created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create tag: ${error.message}`);
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, category, color }: { id: string; name: string; category: TagCategory; color: string }) => {
      const { data, error } = await supabase
        .from('investor_tags')
        .update({ name: name.toUpperCase(), category, color })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-tags'] });
      queryClient.invalidateQueries({ queryKey: ['investor-crm'] });
      toast.success('Tag updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update tag: ${error.message}`);
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('investor_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-tags'] });
      queryClient.invalidateQueries({ queryKey: ['investor-crm'] });
      toast.success('Tag deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete tag: ${error.message}`);
    },
  });
};

export const useAssignTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ investorId, tagId }: { investorId: string; tagId: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('investor_tag_assignments')
        .insert({ 
          investor_id: investorId, 
          tag_id: tagId,
          assigned_by: userData.user?.id 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-crm'] });
      toast.success('Tag assigned successfully');
    },
    onError: (error: Error) => {
      if (error.message.includes('duplicate')) {
        toast.error('Tag already assigned to this investor');
      } else {
        toast.error(`Failed to assign tag: ${error.message}`);
      }
    },
  });
};

export const useRemoveTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ investorId, tagId }: { investorId: string; tagId: string }) => {
      const { error } = await supabase
        .from('investor_tag_assignments')
        .delete()
        .eq('investor_id', investorId)
        .eq('tag_id', tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-crm'] });
      toast.success('Tag removed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove tag: ${error.message}`);
    },
  });
};
