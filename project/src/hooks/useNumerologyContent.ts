import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { numberMeanings } from '@/lib/numerology';

export interface NumberMeaning {
  number: number;
  title: string;
  purpose: string;
  strengths: string[];
  challenges: string[];
  careers: string[];
  relationships: string;
  health: string;
  spiritual: string;
}

// Fetch meanings from DB, fallback to hardcoded
export const useNumberMeanings = (category = 'life_path', language = 'en') => {
  return useQuery({
    queryKey: ['number-meanings', category, language],
    queryFn: async (): Promise<Record<number, NumberMeaning>> => {
      const { data, error } = await supabase
        .from('number_meanings')
        .select('*')
        .eq('category', category)
        .eq('language', language);

      if (error || !data || data.length === 0) {
        // Fallback to hardcoded
        return numberMeanings as Record<number, NumberMeaning>;
      }

      const map: Record<number, NumberMeaning> = {};
      data.forEach((row: any) => {
        map[row.number] = {
          number: row.number,
          title: row.title,
          purpose: row.purpose,
          strengths: row.strengths || [],
          challenges: row.challenges || [],
          careers: row.careers || [],
          relationships: row.relationships || '',
          health: row.health || '',
          spiritual: row.spiritual || '',
        };
      });
      return map;
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
};

export const useUserRole = () => {
  return useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      return data?.map((r: any) => r.role) || [];
    },
    staleTime: 60 * 1000,
  });
};

export const useIsAdmin = () => {
  const { data: roles, isLoading } = useUserRole();
  return {
    isAdmin: roles?.includes('admin') || false,
    isLoading,
  };
};
