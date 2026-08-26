import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { UserFormData } from '@/types/formTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TrustEngineProps {
  formData: UserFormData | null;
  onEditProfile: () => void;
}

export const TrustEngine: React.FC<TrustEngineProps> = ({ formData, onEditProfile }) => {
  const [completeness, setCompleteness] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [factors, setFactors] = useState({
    dob: false,
    name: false,
    mobile: false,
    goals: false,
    profession: false,
    status: false,
    chatHistory: false,
  });

  useEffect(() => {
    if (!formData) return;

    const checkFactors = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const hasDob = !!formData.dateOfBirth;
      const hasName = !!formData.fullBirthName;
      const hasMobile = !!((formData as any).mobileNumber || formData.whatsappNumber);
      const hasGoals = !!(formData.goals && (formData.goals.length > 0 || (typeof formData.goals === 'string' && formData.goals !== '[]')));
      const hasProfession = !!(formData.profession && formData.profession.trim());
      const hasStatus = !!(formData as any).relationshipStatus || !!formData.partnerName;
      
      let hasChat = false;
      if (session) {
        const { count } = await supabase
          .from('ai_chat_history')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);
        hasChat = (count || 0) > 0;
      }

      const f = {
        dob: hasDob,
        name: hasName,
        mobile: hasMobile,
        goals: hasGoals,
        profession: hasProfession,
        status: hasStatus,
        chatHistory: hasChat,
      };

      setFactors(f);

      // Calculation of completeness
      let score = 0;
      if (hasDob) score += 20;
      if (hasName) score += 20;
      if (hasMobile) score += 15;
      if (hasGoals) score += 15;
      if (hasProfession) score += 10;
      if (hasStatus) score += 10;
      if (hasChat) score += 10;

      setCompleteness(score);
      // Accuracy metric is proportional to completeness but scales slightly higher as baseline
      setAccuracy(Math.round(40 + (score * 0.6)));

      // Update public.profiles table
      if (session) {
        await supabase
          .from('profiles')
          .update({ completeness_score: score } as any)
          .eq('user_id', session.user.id);
      }
    };

    checkFactors();
  }, [formData]);

  return (
    <Card className="card-premium relative overflow-hidden border border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="absolute right-0 top-0 h-24 w-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <ShieldCheck className="h-5 w-5 text-primary animate-pulse" />
          Estimated Personalization Score
          <span className="ml-auto text-2xl font-bold font-mono text-primary animate-pulse">{accuracy}%</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Enriching your profile triggers advanced RAG database nodes for more accurate calculations.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span>Profile Completeness</span>
            <span>{completeness}%</span>
          </div>
          <Progress value={completeness} className="h-2 bg-primary/10" />
        </div>

        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {Object.entries({
              dob: { label: 'Birth Date (DOB)', weight: 20, desc: 'Calculates your Driver (Mulank) and Conductor (Bhagyank) numbers.' },
              name: { label: 'Full Birth Name', weight: 20, desc: 'Calculates your Destiny (Namaank), Soul Urge, and Personality numbers.' },
              mobile: { label: 'Mobile Vibration', weight: 15, desc: 'Checks compatibility of your phone number for wealth and opportunities.' },
              goals: { label: 'Core Life Goals', weight: 15, desc: 'Allows the AI guide to tailor remedies to your specific life targets.' },
              profession: { label: 'Profession Details', weight: 10, desc: 'Matches your job/business vibration with your career path numbers.' },
              status: { label: 'Marital/Relationship Status', weight: 10, desc: 'Customizes marriage timing reports and harmony remedies.' },
              chatHistory: { label: 'AI Memory Nodes Activated', weight: 10, desc: 'Logs milestones so the AI guide can correlate historical trends.' }
            }).map(([key, item]) => {
              const active = factors[key as keyof typeof factors];
              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <div
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 cursor-help ${
                        active ? 'bg-green-500/5 text-green-700 dark:text-green-400 border border-green-500/10' : 'bg-muted/40 text-muted-foreground border border-muted-foreground/5'
                      }`}
                    >
                      {active ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      )}
                      <span className="truncate flex-1">{item.label}</span>
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-primary transition-colors shrink-0" />
                      <span className="font-mono text-[10px] font-medium opacity-80">+{item.weight}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-black text-white border border-primary/20 p-2.5 text-xs max-w-xs shadow-xl rounded-xl">
                    <p>{item.desc}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        {completeness < 100 && (
          <Button
            onClick={onEditProfile}
            variant="outline"
            className="w-full text-xs font-medium border-primary/20 hover:bg-primary/5 hover:border-primary/40 group mt-1"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary group-hover:rotate-12 transition-transform" />
            Complete Profile for Deeper Insights
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
