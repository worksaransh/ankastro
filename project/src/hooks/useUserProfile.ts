import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateFullProfile, type NumerologyProfile } from '@/lib/numerology';
import { calculateVedicProfile } from '@/lib/vedicNumerology';
import { calculateLifePillars } from '@/lib/lifePillars';
import { getDailyForecast, type DailyForecast } from '@/lib/dailyForecast';
import { parseDateToDdmmyyyy } from '@/lib/dateUtils';
import {
  calculateLoshuGrid,
  calculatePinnacleCycles,
  calculateChallengeCycles,
  calculateKarmicDebts,
  calculateElementalBalance,
} from '@/lib/advancedNumerology';

export interface UserProfileData {
  user: any | null;
  profile: any | null;
  reflections: any[];
  checkins: any[];
  lifeEvents: any[];
  questions: any[];
  purchasedReports: string[];
  numerology: (NumerologyProfile & { pinnacles?: any[]; challenges?: any[]; karmicDebts?: any[]; elemental?: any }) | null;
  dailyForecast: DailyForecast | null;
  lifePillars: any | null;
  loshu: { present: number[]; missing: number[]; analysis: { arrows: string[] } } | null;
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
}

export const useUserProfile = (): UserProfileData => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [reflections, setReflections] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [lifeEvents, setLifeEvents] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [purchasedReports, setPurchasedReports] = useState<string[]>([]);
  const [numerology, setNumerology] = useState<any | null>(null);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast | null>(null);
  const [lifePillars, setLifePillars] = useState<any | null>(null);
  const [loshu, setLoshu] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      const currentUserId = session.user.id;
      setUser(session.user);

      // Fetch base profile and related intelligence data in parallel
      const [
        profileRes, 
        reflectionsRes, 
        checkinsRes, 
        lifeEventsRes, 
        questionsRes, 
        ordersRes
      ] = await Promise.all([
        supabase.from('profiles').select('*').or(`id.eq.${currentUserId},user_id.eq.${currentUserId}`).maybeSingle(),
        supabase.from('user_reflections').select('*').eq('user_id', currentUserId),
        supabase.from('daily_checkins').select('*').eq('user_id', currentUserId).order('created_at', { ascending: false }).limit(5),
        supabase.from('user_life_events').select('*').eq('user_id', currentUserId).order('event_date', { ascending: false }),
        supabase.from('adaptive_questions').select('*').eq('user_id', currentUserId).not('answer_text', 'is', null),
        supabase.from('report_orders').select('report_key').or(`user_id.eq.${currentUserId},email.eq.${session.user.email}`).eq('status', 'success')
      ]);

      const profileData = profileRes.data || { id: currentUserId, user_id: currentUserId, email: session.user.email };
      setProfile(profileData);
      setReflections(reflectionsRes.data || []);
      setCheckins(checkinsRes.data || []);
      setLifeEvents(lifeEventsRes.data || []);
      setQuestions(questionsRes.data || []);

      const reportsBought = (ordersRes.data || []).map((o: any) => o.report_key);
      setPurchasedReports(reportsBought);

      // Perform calculations if DOB and Name are available
      const dob = profileData?.dob || null;
      const fullName = profileData?.full_birth_name || profileData?.full_name || null;

      if (dob && fullName) {
        // Standard profile calculation using parsed DD/MM/YYYY format
        const cleanDob = parseDateToDdmmyyyy(dob);
        if (cleanDob) {
          const numP = calculateFullProfile(fullName, cleanDob);
          
          // Advanced calculations
          const pinnacles = calculatePinnacleCycles(cleanDob);
          const challenges = calculateChallengeCycles(cleanDob);
          const karmicDebts = calculateKarmicDebts(cleanDob, fullName);
          const elemental = calculateElementalBalance(cleanDob);
          const loshuGrid = calculateLoshuGrid(cleanDob, fullName);
          
          // Vedic Numerology profile
          const vedic = calculateVedicProfile(cleanDob, numP.personalYear);
          
          // Life Pillars computation
          const pillars = calculateLifePillars(vedic, {
            lifePath: numP.lifePath,
            destiny: numP.destiny,
            personalYear: numP.personalYear
          });

          // Today's lucky forecast
          const forecast = getDailyForecast(cleanDob);

          setNumerology({
            ...numP,
            pinnacles,
            challenges,
            karmicDebts,
            elemental
          });
          setLoshu(loshuGrid);
          setLifePillars(pillars);
          setDailyForecast(forecast);
        }
      } else if (dob) {
        // Fallback: calculate forecast with DOB only
        const cleanDob = parseDateToDdmmyyyy(dob);
        if (cleanDob) {
          const forecast = getDailyForecast(cleanDob);
          setDailyForecast(forecast);
        }
      }
    } catch (err) {
      console.error('Error fetching user profile intelligence:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();

    // Listen for auth state modifications
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setNumerology(null);
        setDailyForecast(null);
      } else if (event === 'SIGNED_IN') {
        fetchProfileData();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfileData]);

  return {
    user,
    profile,
    reflections,
    checkins,
    lifeEvents,
    questions,
    purchasedReports,
    numerology,
    dailyForecast,
    lifePillars,
    loshu,
    loading,
    error,
    refetch: fetchProfileData
  };
};
