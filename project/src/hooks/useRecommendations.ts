import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getPersonalizedRecommendations, type Recommendation } from '@/lib/recommendations';

export function useRecommendations(
  profile: any,
  numerology: any,
  purchasedReports: string[],
  activePlus: boolean
) {
  const [dbRecos, setDbRecos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchDbRecos = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setDbRecos([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      setDbRecos(data || []);
    } catch (err) {
      console.error('Error fetching database recommendations:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDbRecos();
  }, [fetchDbRecos]);

  // Compute dismissed recommendation keys
  const dismissedKeys = new Set(
    dbRecos.filter(r => r.dismissed_at).map(r => r.report_key)
  );

  // Compute personalized recommendations and filter dismissed ones
  const activeRecommendations = getPersonalizedRecommendations(
    profile,
    numerology,
    purchasedReports,
    activePlus
  ).filter(reco => !dismissedKeys.has(reco.key));

  const dismissRecommendation = async (recoKey: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const existing = dbRecos.find(r => r.report_key === recoKey);
      const now = new Date().toISOString();

      if (existing) {
        const { error } = await supabase
          .from('recommendations')
          .update({ dismissed_at: now })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('recommendations')
          .insert({
            user_id: session.user.id,
            report_key: recoKey,
            reason: 'User dismissed from dashboard',
            dismissed_at: now
          });
        if (error) throw error;
      }

      // Update local state statefully
      setDbRecos(prev => {
        const idx = prev.findIndex(r => r.report_key === recoKey);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], dismissed_at: now };
          return updated;
        }
        return [...prev, { report_key: recoKey, dismissed_at: now }];
      });
    } catch (err) {
      console.error('Error dismissing recommendation:', err);
    }
  };

  const clickRecommendation = async (recoKey: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const existing = dbRecos.find(r => r.report_key === recoKey);
      const now = new Date().toISOString();

      if (existing) {
        const { error } = await supabase
          .from('recommendations')
          .update({ clicked_at: now })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('recommendations')
          .insert({
            user_id: session.user.id,
            report_key: recoKey,
            reason: 'User clicked recommendation',
            clicked_at: now
          });
        if (error) throw error;
      }

      // Update local state
      setDbRecos(prev => {
        const idx = prev.findIndex(r => r.report_key === recoKey);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], clicked_at: now };
          return updated;
        }
        return [...prev, { report_key: recoKey, clicked_at: now }];
      });
    } catch (err) {
      console.error('Error logging recommendation click:', err);
    }
  };

  return {
    recommendations: activeRecommendations,
    loading,
    error,
    dismissRecommendation,
    clickRecommendation,
    refetch: fetchDbRecos
  };
}
