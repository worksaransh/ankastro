import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CalendarDays, Milestone, HelpCircle, Check, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { UserFormData } from '@/types/formTypes';
import { NumerologyProfile, reduceToSingleDigit } from '@/lib/numerology';
import { PinnacleCycle, ChallengeCycle } from '@/lib/advancedNumerology';
import { toast } from 'sonner';

interface PastReflectionTimelineProps {
  formData: UserFormData;
  profile: NumerologyProfile;
  pinnacleCycles: PinnacleCycle[];
  challengeCycles: ChallengeCycle[];
}

interface ReflectionItem {
  id: string;
  age_range: string;
  time_period: string;
  reflection_text: string;
  rating: string | null;
  unlockQuestion: string;
  category: 'career' | 'relationships' | 'finance' | 'education' | 'lifestyle';
  answer: string | null;
}

export const PastReflectionTimeline: React.FC<PastReflectionTimelineProps> = ({
  formData,
  profile,
  pinnacleCycles,
  challengeCycles
}) => {
  const [reflections, setReflections] = useState<ReflectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate reflection statements dynamically based on their actual numerology
  const generateReflectionData = (): ReflectionItem[] => {
    if (!formData || !formData.dateOfBirth) return [];
    try {
      const birthYear = new Date(formData.dateOfBirth.split('/').reverse().join('-')).getFullYear();
      
      const pin1 = pinnacleCycles[0];
      const pin2 = pinnacleCycles[1];
      const chal1 = challengeCycles[0];

      // Possibility-based template engines matching their actual numbers
      const reflectionsList: ReflectionItem[] = [
        {
          id: 'ref-1',
          age_range: `Ages ${pin1?.ages || '18-25'}`,
          time_period: `${birthYear + 18} - ${birthYear + 25}`,
          reflection_text: `Under your first Pinnacle Cycle ${pin1?.number || profile.lifePath}, your chart suggests a period where key educational choices or early career ambitions began to actively shape your path. There was a strong energetic theme of learning to establish your own voice.`,
          rating: null,
          unlockQuestion: 'Did you complete higher studies or start your very first job during this phase?',
          category: 'education',
          answer: null
        },
        {
          id: 'ref-2',
          age_range: `Ages ${pin2?.ages || '26-32'}`,
          time_period: `${birthYear + 26} - ${birthYear + 32}`,
          reflection_text: `Transitioning into a second cycle of ${pin2?.number || profile.destiny}, patterns indicate a phase of increased responsibility or emotional growth. This shift often manifests as establishing security in relationships, home, or primary work.`,
          rating: null,
          unlockQuestion: 'Did you experience a major change in relationship status (marriage/engagement) or relocate during this period?',
          category: 'relationships',
          answer: null
        },
        {
          id: 'ref-3',
          age_range: 'Recent Years (2021-2022)',
          time_period: '2021 - 2022',
          reflection_text: `Vibrations under Challenge Cycle ${chal1?.number || 4} indicate a period where patience, structural changes, or financial re-budgeting may have become necessary. This cycle represents a transition towards deep self-reliance.`,
          rating: null,
          unlockQuestion: 'Did you switch jobs, start a venture, or make major changes in your investments in 2021/2022?',
          category: 'finance',
          answer: null
        }
      ];

      return reflectionsList;
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const fetchSavedData = async () => {
      setIsLoading(true);
      const generated = generateReflectionData();
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setReflections(generated);
          setIsLoading(false);
          return;
        }

        // Fetch saved reflections
        const { data: savedRefs } = await supabase
          .from('user_reflections')
          .select('age_range, accuracy_rating')
          .eq('user_id', session.user.id);

        // Fetch saved answers
        const { data: savedAnswers } = await supabase
          .from('adaptive_questions')
          .select('question_text, answer_text')
          .eq('user_id', session.user.id);

        const updated = generated.map((item) => {
          const matchedRef = savedRefs?.find((r) => r.age_range === item.age_range);
          const matchedAnswer = savedAnswers?.find((a) => a.question_text === item.unlockQuestion);
          return {
            ...item,
            rating: matchedRef ? matchedRef.accuracy_rating : null,
            answer: matchedAnswer ? matchedAnswer.answer_text : null
          };
        });

        setReflections(updated);
      } catch (err) {
        console.error(err);
        setReflections(generated);
      } finally {
        setIsLoading(false);
      }
    };

    if (pinnacleCycles.length > 0) {
      fetchSavedData();
    }
  }, [formData, pinnacleCycles, challengeCycles]);

  const handleRateReflection = async (index: number, ratingValue: string) => {
    const target = reflections[index];
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to save ratings.');
        return;
      }

      // Upsert reflection feedback
      const { error } = await supabase
        .from('user_reflections')
        .upsert({
          user_id: session.user.id,
          reflection_text: target.reflection_text,
          age_range: target.age_range,
          time_period: target.time_period,
          accuracy_rating: ratingValue
        } as any, { onConflict: 'user_id,age_range,time_period' });

      if (error) throw error;

      // Update state
      setReflections((prev) =>
        prev.map((item, idx) => (idx === index ? { ...item, rating: ratingValue } : item))
      );
      toast.success('Feedback recorded! Thank you.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save feedback.');
    }
  };

  const handleAnswerQuestion = async (index: number, answerText: string) => {
    const target = reflections[index];
    if (!answerText.trim()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to save responses.');
        return;
      }

      // Upsert adaptive questions
      const { error } = await supabase
        .from('adaptive_questions')
        .upsert({
          user_id: session.user.id,
          question_text: target.unlockQuestion,
          category: target.category,
          answer_text: answerText,
          answered_at: new Date().toISOString()
        } as any, { onConflict: 'user_id,question_text' });

      if (error) throw error;

      // Update state
      setReflections((prev) =>
        prev.map((item, idx) => (idx === index ? { ...item, answer: answerText } : item))
      );
      toast.success('Milestone details updated in AI Memory.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save response.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 py-8 text-center animate-pulse">
        <Sparkles className="h-8 w-8 text-primary mx-auto animate-spin" />
        <p className="text-xs text-muted-foreground">Synthesizing personal reflection timeline...</p>
      </div>
    );
  }

  return (
    <Card className="card-premium relative overflow-hidden border border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <Milestone className="h-5 w-5 text-primary" />
          Past Reflection & Validation Timeline
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Verify calculations against your past experiences. This improves explainability and future recommendation accuracy.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-6 relative border-l border-primary/20 pl-6 ml-3">
          {reflections.map((item, index) => (
            <div key={item.id} className="relative space-y-3">
              {/* Indicator Dot */}
              <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background shadow-sm" />
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">
                  {item.age_range} ({item.time_period})
                </span>
                <p className="text-xs text-foreground leading-relaxed pt-1.5">
                  {item.reflection_text}
                </p>
              </div>

              {/* Validation Loop */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground">How well does this match your experience?</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'very_accurate', label: '✅ Very Accurate' },
                    { value: 'mostly_accurate', label: '👍 Mostly Accurate' },
                    { value: 'partially_accurate', label: '🤔 Partially Accurate' },
                    { value: 'not_accurate', label: '❌ Not Accurate' }
                  ].map((btn) => (
                    <Button
                      key={btn.value}
                      size="sm"
                      variant={item.rating === btn.value ? 'default' : 'outline'}
                      onClick={() => handleRateReflection(index, btn.value)}
                      className="text-[10px] py-1 h-auto px-2 font-normal"
                    >
                      {btn.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Memory Unlock Panel */}
              <div className="p-3 bg-muted/40 rounded-lg border border-border/40 space-y-2 mt-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>AI Memory Unlock</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{item.unlockQuestion}</p>
                
                {item.answer ? (
                  <div className="flex items-center gap-2 p-2 bg-green-500/5 text-green-700 dark:text-green-400 border border-green-500/10 rounded text-xs font-medium">
                    <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-500 shrink-0" />
                    <span className="truncate flex-1">Confirmed: "{item.answer}"</span>
                    <Button
                      onClick={() => handleAnswerQuestion(index, '')}
                      variant="ghost"
                      className="text-[10px] hover:bg-destructive/5 hover:text-destructive h-auto p-1 font-normal"
                    >
                      Clear
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Share brief details..."
                      className="text-xs h-8"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAnswerQuestion(index, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling as HTMLInputElement;
                        if (input) {
                          handleAnswerQuestion(index, input.value);
                          input.value = '';
                        }
                      }}
                      className="text-[10px] h-8 font-medium"
                    >
                      Confirm
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-amber-500/5 text-amber-700 dark:text-amber-400 border border-amber-500/10 rounded-lg text-xs flex gap-2">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-500" />
          <p className="leading-relaxed">
            <strong>Ethical Numerology Principle:</strong> Reflections are indicators of energy potentials, not absolute facts. Share your confirmation feedback to sharpen personalization algorithms.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
