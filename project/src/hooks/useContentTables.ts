import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getLuckyAttributes, calculateCompatibility } from '@/lib/numerology';

/* ============================================================
   useTestimonials — reads public.testimonials (active only),
   falls back to a small hardcoded set if DB empty/unreachable.
   ============================================================ */
export interface Testimonial {
  name: string;
  rating: number;
  text: string;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { rating: 5, text: 'Mere life mein ek clarity aa gayi report padhke. Sach mein amazing hai!', name: 'Priya S., Delhi' },
  { rating: 5, text: 'Career ke baare mein jo btaya woh bilkul sahi nikla. Highly recommend!', name: 'Rahul M., Mumbai' },
];

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async (): Promise<Testimonial[]> => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('name, rating, text, active, sort_order')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) return FALLBACK_TESTIMONIALS;
      return data.map((r: any) => ({ name: r.name, rating: r.rating ?? 5, text: r.text }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

/* ============================================================
   useLuckyAttributes — reads public.lucky_attributes for a
   number+language, falls back to hardcoded getLuckyAttributes.
   ============================================================ */
export interface LuckyAttributes {
  numbers: number[];
  days: string[];
  colors: string[];
  directions: string[];
}

export const useLuckyAttributes = (num: number, language = 'en') => {
  return useQuery({
    queryKey: ['lucky-attributes', num, language],
    queryFn: async (): Promise<LuckyAttributes> => {
      const { data, error } = await supabase
        .from('lucky_attributes')
        .select('*')
        .eq('number', num)
        .eq('language', language)
        .maybeSingle();

      if (error || !data) {
        const fb = getLuckyAttributes(num);
        return { numbers: fb.numbers, days: fb.days, colors: fb.colors, directions: fb.directions };
      }
      return {
        numbers: data.lucky_numbers || [],
        days: data.lucky_days || [],
        colors: data.lucky_colors || [],
        directions: data.lucky_directions || [],
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

/* ============================================================
   useCompatibility — reads public.compatibility_data for a
   number pair+language, falls back to hardcoded matrix.
   Pairs are stored order-independent (min,max).
   ============================================================ */
export interface CompatibilityResult {
  score: number;
  strength: string;
  challenges: string;
  detailed_analysis: string;
}

export const useCompatibility = (n1: number, n2: number, language = 'en') => {
  const a = Math.min(n1, n2);
  const b = Math.max(n1, n2);
  return useQuery({
    queryKey: ['compatibility', a, b, language],
    enabled: n1 > 0 && n2 > 0,
    queryFn: async (): Promise<CompatibilityResult> => {
      const { data, error } = await supabase
        .from('compatibility_data')
        .select('*')
        .eq('number1', a)
        .eq('number2', b)
        .eq('language', language)
        .maybeSingle();

      if (error || !data) {
        const fb = calculateCompatibility(n1, n2);
        return {
          score: fb.score,
          strength: fb.strength,
          challenges: fb.challenges,
          detailed_analysis: '',
        };
      }
      return {
        score: data.score,
        strength: data.strength || '',
        challenges: data.challenges || '',
        detailed_analysis: data.detailed_analysis || '',
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
