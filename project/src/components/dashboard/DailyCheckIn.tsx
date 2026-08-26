import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CalendarRange, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { UserFormData } from '@/types/formTypes';
import { toast } from 'sonner';
import { parseDateToDdmmyyyy } from '@/lib/dateUtils';

interface DailyCheckInProps {
  formData: UserFormData | null;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({ formData }) => {
  const [mood, setMood] = useState<'great' | 'good' | 'neutral' | 'stressed' | null>(null);
  const [focus, setFocus] = useState<'career' | 'business' | 'love' | 'money' | 'health' | 'family' | null>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [dailyAdvice, setDailyAdvice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user already checked in today
    const checkTodayLog = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', today + 'T00:00:00')
        .lte('created_at', today + 'T23:59:59')
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setMood(data[0].mood as any);
        setFocus(data[0].focus_area as any);
        setHasCheckedIn(true);
        generateAdvice(data[0].mood, data[0].focus_area);
      }
    };

    checkTodayLog();
  }, [formData]);

  const calculatePersonalDay = (): number => {
    if (!formData || !formData.dateOfBirth) return 1;
    try {
      const cleanDob = parseDateToDdmmyyyy(formData.dateOfBirth);
      if (!cleanDob) return 1;
      const [dayStr, monthStr] = cleanDob.split('/');
      const birthDay = parseInt(dayStr, 10);
      const birthMonth = parseInt(monthStr, 10);
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const currentDay = now.getDate();

      // Helper to reduce number to single digit
      const reduce = (n: number): number => {
        let sum = n;
        while (sum > 9) {
          sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
        }
        return sum;
      };

      const personalYear = reduce(birthDay + birthMonth + currentYear);
      const personalMonth = reduce(personalYear + currentMonth);
      const personalDay = reduce(personalMonth + currentDay);

      return personalDay;
    } catch {
      return 1;
    }
  };

  const generateAdvice = (userMood: string, userFocus: string) => {
    const personalDay = calculatePersonalDay();
    
    // Focus maps
    const focusAdviceMap: Record<string, Record<number, string>> = {
      career: {
        1: 'A day for bold action. Take ownership of your tasks and pitches.',
        2: 'Seek cooperation. Balance your views and team up for career alignment.',
        3: 'Share your creative solutions. Presenting ideas today attracts active support.',
        4: 'Focus on detailed audits. Build systems that anchor long-term stability.',
        5: 'Pivot where needed. A great day to network, pitch, or explore new routes.',
        6: 'Mentor or support colleagues. Responsibility today yields reputation growth.',
        7: 'Conduct research or introspective evaluations before taking massive steps.',
        8: 'An excellent period for leadership, negotiating terms, or pushing projects forward.',
        9: 'Conclude unfinished tasks. Clear out legacy projects to make room for growth.',
      },
      business: {
        1: 'Launch new initiatives or campaigns. Bold starts yield high energy.',
        2: 'Focus on contracts, partnerships, and joint agreements today.',
        3: 'Marketing and PR campaigns thrive under this expressive number.',
        4: 'Review financial sheets and operations. Tighten up loose loose ends.',
        5: 'Look out for dynamic pivoting opportunities. Adapt to client needs.',
        6: 'Prioritize service quality and customer support systems.',
        7: 'Evaluate your niche strategy. A day for strategic thinking, not loud launches.',
        8: 'Focus on revenue goals, scaling systems, and financial transactions.',
        9: 'Complete pending deliveries and review client satisfaction logs.',
      },
      love: {
        1: 'Express your honest feelings. Independence and authenticity strengthen love.',
        2: 'Harmony and empathetic listening are your greatest assets today.',
        3: 'Bring playfulness and lighthearted joy into your relationships.',
        4: 'Create practical routines and build security with your partner.',
        5: 'Embrace positive shifts. Try a new experience or activity together.',
        6: 'Prioritize home comfort, family alignment, and deep affection.',
        7: 'Introspective space. Mutual understanding comes from silent support.',
        8: 'Support each other\'s ambitions. Balance power dynamics with love.',
        9: 'Forgive past grievances and seek deep closure in open discussions.',
      },
      money: {
        1: 'Take charge of your portfolio. Invest in your own skills and starts.',
        2: 'Consult a trusted partner or planner before signing agreements.',
        3: 'Avoid impulse spending on entertainment. Focus on expressive investments.',
        4: 'Budget meticulously. Small daily balances create compound stability.',
        5: 'Explore dynamic diversification of assets but stay alert to sudden shifts.',
        6: 'Invest in home security, family welfare, or foundational assets.',
        7: 'Audit your expenses and look beneath the surface of financial contracts.',
        8: 'A strong day for wealth attraction. Push for promotions, sales, or collections.',
        9: 'Clear debts or make charitable contributions to balance your money karma.',
      },
      health: {
        1: 'Start a new fitness routine. Personal physical vitality is highly supported.',
        2: 'Focus on emotional harmony and mental peace. Calm your nervous system.',
        3: 'Express joy and release stress through dance, sports, or laughter.',
        4: 'Focus on consistency. Fixed sleep and meal patterns build stamina.',
        5: 'Avoid restlessness. Spend time outdoors and break stagnant postures.',
        6: 'Nurture yourself. Warm home-cooked meals and rest restore your balance.',
        7: 'Meditate. Internal silence is the ultimate antidote to nervous stress.',
        8: 'Incorporate strength training and monitor your posture and body alignment.',
        9: 'Detox. Release toxic habits, drink clean water, and rest fully today.',
      },
      family: {
        1: 'Guide younger family members. Take lead in organizing home affairs.',
        2: 'Listen carefully. Patience is the absolute key to domestic peace today.',
        3: 'Enjoy creative shared activities. Keep conversations bright.',
        4: 'Organize household logistics, chores, or maintenance projects.',
        5: 'Plan a spontaneous outing or dynamic change in the home routine.',
        6: 'The ultimate day for family bonding. Nurture and cook with loved ones.',
        7: 'Give family members their own quiet space while maintaining supportive love.',
        8: 'Secure family finances or address logical, long-term household assets.',
        9: 'Release old family dynamics or generational misunderstandings with love.',
      }
    };

    const moodModifiers: Record<string, string> = {
      great: 'Capitalize on this positive wave! ',
      good: 'Keep this steady flow going. ',
      neutral: 'A perfect day to ground yourself and observe. ',
      stressed: 'Gently breathe. Take things slow and protect your peace today. '
    };

    const baseAdvice = focusAdviceMap[userFocus]?.[personalDay] || 'Follow your intuition and align your actions with your core values today.';
    const moodPrefix = moodModifiers[userMood] || '';
    
    setDailyAdvice(`${moodPrefix}Based on your Personal Day ${personalDay} and your focus on ${userFocus.toUpperCase()}: ${baseAdvice}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood || !focus) {
      toast.error('Please select both your mood and daily focus.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to log your daily check-in.');
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('daily_checkins')
        .insert({
          user_id: session.user.id,
          mood,
          focus_area: focus
        });

      if (error) throw error;

      setHasCheckedIn(true);
      generateAdvice(mood, focus);
      toast.success('Daily check-in logged! Enjoy your guidance.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to log check-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="card-premium relative overflow-hidden border border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <CalendarRange className="h-5 w-5 text-primary" />
          Daily Check-In & Advice
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Track your daily vibrations and align your focus with cosmic timing.
        </p>
      </CardHeader>
      
      <CardContent>
        {!hasCheckedIn ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mood selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold block text-foreground">How are you feeling today?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'great', label: '😊 Great' },
                  { value: 'good', label: '🙂 Good' },
                  { value: 'neutral', label: '😐 Neutral' },
                  { value: 'stressed', label: '😟 Stressed' }
                ].map((item) => (
                  <Button
                    key={item.value}
                    type="button"
                    variant={mood === item.value ? 'default' : 'outline'}
                    onClick={() => setMood(item.value as any)}
                    className="text-xs py-2 h-auto text-center font-normal"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Focus selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold block text-foreground">What is your primary focus today?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { value: 'career', label: '💼 Career' },
                  { value: 'business', label: '📈 Business' },
                  { value: 'love', label: '❤️ Love' },
                  { value: 'money', label: '💰 Money' },
                  { value: 'health', label: '🌿 Health' },
                  { value: 'family', label: '👨‍👩‍👧 Family' }
                ].map((item) => (
                  <Button
                    key={item.value}
                    type="button"
                    variant={focus === item.value ? 'default' : 'outline'}
                    onClick={() => setFocus(item.value as any)}
                    className="text-xs py-2 h-auto text-center font-normal"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full text-xs font-medium mt-2">
              {isSubmitting ? 'Logging...' : 'Submit Check-In'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-500/5 text-green-700 dark:text-green-400 border border-green-500/10 rounded-lg text-xs font-medium">
              <Check className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0" />
              <span>You have checked in for today! Your custom advice is ready.</span>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 relative">
              <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-semibold font-mono text-primary/60 flex items-center gap-1">
                <Sparkles className="h-3 w-3 animate-spin" /> Daily Alignment
              </div>
              <p className="text-sm text-foreground leading-relaxed pt-2">
                {dailyAdvice}
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() => setHasCheckedIn(false)}
              className="text-xs text-primary/80 hover:text-primary hover:bg-primary/5 h-auto py-1 px-2"
            >
              Update Focus/Mood
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
