import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ChevronRight, ChevronLeft, Check, Target, Heart, Briefcase, Users, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { calculateBirthday, calculateLifePath } from '@/lib/numerology';
import { calculatePsychologicalBaseline, saveUserPsychology } from '@/lib/psychology';
import { safeUpsertProfile } from '@/lib/profileHelper';
import DobInput from '@/components/DobInput';

interface OnboardingQuestionnaireProps {
  userId: string;
  language: string;
  onComplete: (data: any) => void;
}

interface StepData {
  dob: string;
  goal: string;
  challenge: string;
  profession: string;
  maritalStatus: string;
  birthTime: string;
  gender: string;
  fullBirthName: string;
  displayName: string;
  birthPlace: string;
  industry: string;
  isBusinessOwner: boolean;
}

const STEPS = [
  { id: 'goal', icon: Target, title: 'What\'s your primary life goal right now?', titleHi: 'आपका प्राथमिक जीवन लक्ष्य क्या है?' },
  { id: 'challenge', icon: Heart, title: 'What\'s your biggest current challenge?', titleHi: 'आपकी सबसे बड़ी वर्तमान चुनौती क्या है?' },
  { id: 'name', icon: User, title: 'What is your full birth name & nickname?', titleHi: 'आपका पूरा जन्म नाम और उपनाम क्या है?' },
  { id: 'profession', icon: Briefcase, title: 'Tell us about your professional life', titleHi: 'अपने व्यावसायिक जीवन के बारे में बताएं' },
  { id: 'relationship', icon: Users, title: 'What\'s your relationship status & gender?', titleHi: 'आपकी रिश्ते की स्थिति और लिंग क्या है?' },
  { id: 'birth', icon: Clock, title: 'When and where were you born?', titleHi: 'आपका जन्म कब और कहाँ हुआ?' },
];

const GOALS = [
  { value: 'career_growth', label: '📈 Career Growth', labelHi: '📈 करियर में उन्नति' },
  { value: 'financial_freedom', label: '💰 Financial Freedom', labelHi: '💰 आर्थिक स्वतंत्रता' },
  { value: 'find_love', label: '❤️ Find Love', labelHi: '❤️ प्यार ढूंढना' },
  { value: 'health_wellness', label: '🌿 Health & Wellness', labelHi: '🌿 स्वास्थ्य' },
  { value: 'business', label: '🚀 Start/Grow Business', labelHi: '🚀 व्यापार शुरू/बढ़ाना' },
  { value: 'spiritual_growth', label: '🧘 Spiritual Growth', labelHi: '🧘 आध्यात्मिक विकास' },
];

const CHALLENGES = [
  { value: 'career_stuck', label: '😤 Career feels stuck', labelHi: '😤 करियर रुका हुआ लगता है' },
  { value: 'money_issues', label: '💸 Money problems', labelHi: '💸 पैसों की समस्या' },
  { value: 'relationship_issues', label: '💔 Relationship struggles', labelHi: '💔 रिश्तों में परेशानी' },
  { value: 'health_concerns', label: '🏥 Health concerns', labelHi: '🏥 स्वास्थ्य संबंधी चिंता' },
  { value: 'decision_confusion', label: '🤔 Can\'t make decisions', labelHi: '🤔 निर्णय नहीं ले पा रहे' },
  { value: 'lack_direction', label: '🧭 Lack of life direction', labelHi: '🧭 जीवन में दिशा की कमी' },
];

const OnboardingQuestionnaire = ({ userId, language, onComplete }: OnboardingQuestionnaireProps) => {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<StepData>({
    dob: '',
    goal: '',
    challenge: '',
    profession: '',
    maritalStatus: 'single',
    birthTime: '',
    gender: 'male',
    fullBirthName: '',
    displayName: '',
    birthPlace: '',
    industry: '',
    isBusinessOwner: false,
  });

  const isHi = language === 'hi';
  const currentStep = STEPS[step];
  const StepIcon = currentStep.icon;
  const progress = ((step + 1) / STEPS.length) * 100;

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email || '';

      // Calculate Mulank & Bhagyank from DOB if available
      let mulank = 1;
      let bhagyank = 1;
      if (data.dob) {
        // dob format YYYY-MM-DD -> convert to DD/MM/YYYY for numerology functions
        const parts = data.dob.split('-');
        if (parts.length === 3) {
          const formattedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
          mulank = calculateBirthday(formattedDob);
          bhagyank = calculateLifePath(formattedDob);
        }
      }

      // Compute personalization score
      let score = 30; // base score for account creation
      if (data.dob) score += 20;
      if (data.fullBirthName) score += 15;
      if (data.profession) score += 15;
      if (data.goal) score += 10;
      if (data.birthTime && data.birthPlace) score += 10;
      score = Math.min(score, 100);

      const profilePayload = {
        id: userId,
        user_id: userId,
        email: userEmail,
        full_name: data.displayName || data.fullBirthName || '',
        full_birth_name: data.fullBirthName || '',
        display_name: data.displayName || '',
        dob: data.dob || null,
        gender: data.gender,
        profession: data.profession,
        goals: { primary: data.goal, challenge: data.challenge },
        marital_status: data.maritalStatus,
        birth_time: data.birthTime || null,
        birth_place: data.birthPlace,
        industry: data.industry,
        is_business_owner: data.isBusinessOwner,
        mulank,
        bhagyank,
        personalization_score: score,
        updated_at: new Date().toISOString(),
      };

      await safeUpsertProfile(profilePayload);

      // Save baseline psychological profile asynchronously
      const baseline = calculatePsychologicalBaseline({
        mulank,
        bhagyank,
        profession: data.profession,
        isBusinessOwner: data.isBusinessOwner,
        goal: data.goal,
      });
      await saveUserPsychology(userId, baseline);

      toast.success(isHi ? 'प्रोफ़ाइल सेटअप पूरा!' : 'Profile setup complete! 🎉');
      onComplete({ ...data, mulank, bhagyank, personalizationScore: score });
    } catch (e: any) {
      toast.error(e.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const canAdvance = () => {
    if (step === 0) return !!data.goal;
    if (step === 1) return !!data.challenge;
    if (step === 2) return !!data.fullBirthName;
    if (step === 3) return !!data.profession;
    if (step === 4) return true; // Default selects available
    if (step === 5) return !!data.dob;
    return true;
  };

  return (
    <Card className="glass-card-mystical border-primary/20 overflow-hidden">
      <CardContent className="pt-6 pb-6">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {isHi ? 'व्यक्तिगत सेटअप' : 'Personal Setup'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{step + 1}/{STEPS.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-primary to-violet-400 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <StepIcon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">
            {isHi ? currentStep.titleHi : currentStep.title}
          </h3>
        </div>

        {/* Step Content */}
        <div className="min-h-[160px] space-y-4">
          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setData({ ...data, goal: g.value })}
                  className={`
                    text-left p-3 rounded-xl border text-sm transition-all duration-200
                    ${data.goal === g.value
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/20 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {isHi ? g.labelHi : g.label}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CHALLENGES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setData({ ...data, challenge: c.value })}
                  className={`
                    text-left p-3 rounded-xl border text-sm transition-all duration-200
                    ${data.challenge === c.value
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/20 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {isHi ? c.labelHi : c.label}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="fullBirthName">{isHi ? 'पूरा जन्म नाम (अंक ज्योतिष के लिए)' : 'Full Birth Name (for Numerology calculations) *'}</Label>
                <Input
                  id="fullBirthName"
                  type="text"
                  placeholder={isHi ? 'जैसे: Aarav Kumar Sharma' : 'e.g. Aarav Kumar Sharma'}
                  value={data.fullBirthName}
                  onChange={(e) => setData({ ...data, fullBirthName: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="displayName">{isHi ? 'उपनाम / पुकारने का नाम (वैकल्पिक)' : 'Nickname / Display Name (optional)'}</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder={isHi ? 'जैसे: Aarav' : 'e.g. Aarav'}
                  value={data.displayName}
                  onChange={(e) => setData({ ...data, displayName: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="profession">{isHi ? 'व्यवसाय' : 'Profession *'}</Label>
                  <Input
                    id="profession"
                    type="text"
                    placeholder={isHi ? 'जैसे: Software Engineer' : 'e.g. Software Engineer'}
                    value={data.profession}
                    onChange={(e) => setData({ ...data, profession: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="industry">{isHi ? 'उद्योग / कार्यक्षेत्र' : 'Industry'}</Label>
                  <Input
                    id="industry"
                    type="text"
                    placeholder={isHi ? 'जैसे: IT, शिक्षा, वित्त' : 'e.g. Tech, Education, Finance'}
                    value={data.industry}
                    onChange={(e) => setData({ ...data, industry: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="isBusinessOwner"
                  type="checkbox"
                  className="w-4 h-4 rounded text-primary focus:ring-primary bg-white/5 border-white/10 cursor-pointer"
                  checked={data.isBusinessOwner}
                  onChange={(e) => setData({ ...data, isBusinessOwner: e.target.checked })}
                />
                <Label htmlFor="isBusinessOwner" className="cursor-pointer select-none text-sm font-medium text-gray-300">
                  {isHi ? 'मैं व्यवसाय का स्वामी / संस्थापक हूँ' : 'I am a Business Owner / Founder'}
                </Label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{isHi ? 'लिंग' : 'Gender'}</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#161326] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                    value={data.gender}
                    onChange={(e) => setData({ ...data, gender: e.target.value })}
                  >
                    <option value="male">{isHi ? 'पुरुष' : 'Male'}</option>
                    <option value="female">{isHi ? 'महिला' : 'Female'}</option>
                    <option value="other">{isHi ? 'अन्य' : 'Other'}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{isHi ? 'रिश्ते की स्थिति' : 'Relationship'}</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#161326] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                    value={data.maritalStatus}
                    onChange={(e) => setData({ ...data, maritalStatus: e.target.value })}
                  >
                    <option value="single">{isHi ? 'अविवाहित' : 'Single'}</option>
                    <option value="married">{isHi ? 'विवाहित' : 'Married'}</option>
                    <option value="divorced">{isHi ? 'तलाकशुदा' : 'Divorced'}</option>
                    <option value="separated">{isHi ? 'अलग' : 'Separated'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="dob">{isHi ? 'जन्म तिथि *' : 'Date of Birth *'}</Label>
                <DobInput id="dob" value={data.dob} onChange={(v) => setData({ ...data, dob: v })} outputFormat="yyyy-mm-dd" language={language} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="birthTime">
                    {isHi ? 'जन्म समय (वैकल्पिक)' : 'Birth Time (optional)'}
                  </Label>
                  <Input
                    id="birthTime"
                    type="time"
                    value={data.birthTime}
                    onChange={(e) => setData({ ...data, birthTime: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="birthPlace">
                    {isHi ? 'जन्म स्थान (वैकल्पिक)' : 'Birth Place (optional)'}
                  </Label>
                  <Input
                    id="birthPlace"
                    type="text"
                    placeholder={isHi ? 'जैसे: मुंबई, दिल्ली' : 'e.g. Mumbai, Delhi'}
                    value={data.birthPlace}
                    onChange={(e) => setData({ ...data, birthPlace: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="gap-1 text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            {isHi ? 'पीछे' : 'Back'}
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              size="sm"
              onClick={() => setStep(step + 1)}
              disabled={!canAdvance()}
              className="gap-1 bg-primary hover:bg-primary/90"
            >
              {isHi ? 'आगे' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!canAdvance() || saving}
              className="gap-1 bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90"
            >
              <Check className="w-4 h-4" />
              {saving ? (isHi ? 'सेव हो रहा है...' : 'Saving...') : (isHi ? 'पूरा करें' : 'Complete Setup')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingQuestionnaire;
