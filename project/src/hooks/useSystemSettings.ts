import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data } = await supabase.from('system_settings').select('key, value');
      const map: Record<string, string> = {};
      (data || []).forEach((s: any) => { map[s.key] = s.value; });
      return map;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useSiteContent = (language = 'en') => {
  return useQuery({
    queryKey: ['site-content', language],
    queryFn: async () => {
      const { data } = await supabase.from('site_content').select('key, value, content_type').eq('language', language);
      const map: Record<string, string> = {};
      (data || []).forEach((s: any) => { map[s.key] = s.value; });
      return map;
    },
    staleTime: 2 * 60 * 1000,
  });
};
