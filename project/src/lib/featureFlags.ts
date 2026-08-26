import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFeatureFlags = () => {
  return useQuery({
    queryKey: ['feature-flags'],
    queryFn: async () => {
      const { data } = await supabase.from('feature_flags').select('key, enabled');
      const map: Record<string, boolean> = {};
      (data || []).forEach((r: any) => { map[r.key] = !!r.enabled; });
      return map;
    },
    staleTime: 60_000,
  });
};

export const useFeatureFlag = (key: string, defaultValue = false) => {
  const { data } = useFeatureFlags();
  return data?.[key] ?? defaultValue;
};
