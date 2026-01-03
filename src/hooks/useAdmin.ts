// Admin hooks for site configuration, feature flags, and audit logs
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// Types
export interface SiteConfig {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  enabled: boolean;
  description: string | null;
  metadata: any;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  content: any;
  sort_order: number;
  is_visible: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_value: any;
  new_value: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// Site Config Hook
export function useSiteConfig() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: configs, isLoading } = useQuery({
    queryKey: ['site-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .order('category', { ascending: true });
      if (error) throw error;
      return data as SiteConfig[];
    },
  });

  const updateConfig = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('site_config')
        .update({ value: JSON.stringify(value) })
        .eq('key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-config'] });
      toast({ title: 'Configuration updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update configuration', description: error.message, variant: 'destructive' });
    },
  });

  const getConfig = (key: string) => {
    const config = configs?.find(c => c.key === key);
    if (!config) return null;
    try {
      return typeof config.value === 'string' ? JSON.parse(config.value) : config.value;
    } catch {
      return config.value;
    }
  };

  return { configs, isLoading, updateConfig, getConfig };
}

// Feature Flags Hook
export function useFeatureFlags() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: flags, isLoading } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('key', { ascending: true });
      if (error) throw error;
      return data as FeatureFlag[];
    },
  });

  const toggleFlag = useMutation({
    mutationFn: async ({ key, enabled }: { key: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('feature_flags')
        .update({ enabled })
        .eq('key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      toast({ title: 'Feature flag updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update feature flag', description: error.message, variant: 'destructive' });
    },
  });

  const isEnabled = (key: string) => {
    return flags?.find(f => f.key === key)?.enabled ?? false;
  };

  return { flags, isLoading, toggleFlag, isEnabled };
}

// Page Content Hook
export function usePageContent(pageSlug?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery({
    queryKey: ['page-content', pageSlug],
    queryFn: async () => {
      let query = supabase.from('page_content').select('*');
      if (pageSlug) {
        query = query.eq('page_slug', pageSlug);
      }
      const { data, error } = await query.order('sort_order', { ascending: true });
      if (error) throw error;
      return data as PageContent[];
    },
  });

  const updateContent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PageContent> }) => {
      const { error } = await supabase
        .from('page_content')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      toast({ title: 'Content updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to update content', description: error.message, variant: 'destructive' });
    },
  });

  const createContent = useMutation({
    mutationFn: async (newContent: Omit<PageContent, 'id' | 'created_at' | 'updated_at' | 'updated_by'>) => {
      const { error } = await supabase.from('page_content').insert(newContent);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      toast({ title: 'Content created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to create content', description: error.message, variant: 'destructive' });
    },
  });

  const deleteContent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('page_content').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      toast({ title: 'Content deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to delete content', description: error.message, variant: 'destructive' });
    },
  });

  return { content, isLoading, updateContent, createContent, deleteContent };
}

// Audit Log Hook
export function useAuditLog(limit = 50) {
  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['audit-log', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as AuditLogEntry[];
    },
  });

  return { logs, isLoading, refetch };
}

// Admin Stats Hook
export function useAdminStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [animals, users, bookings, donations, stories, volunteers] = await Promise.all([
        supabase.from('animals').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('donations').select('amount').eq('status', 'completed'),
        supabase.from('stories').select('id', { count: 'exact', head: true }),
        supabase.from('volunteers').select('id', { count: 'exact', head: true }),
      ]);

      const totalDonations = donations.data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      return {
        totalAnimals: animals.count || 0,
        totalUsers: users.count || 0,
        totalBookings: bookings.count || 0,
        totalDonations,
        totalStories: stories.count || 0,
        totalVolunteers: volunteers.count || 0,
      };
    },
  });

  return { stats, isLoading };
}
