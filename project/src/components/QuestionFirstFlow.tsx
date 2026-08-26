import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sparkles, ArrowRight, Check, Compass, Clock, MapPin, Calendar, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LIFE_TOPICS_METADATA, LifeTopic } from '@/lib/combinedIntelligenceEngine';
import { CITY_GEO_DATABASE } from '@/lib/vedicAstrologyEngine';
import DobInput from '@/components/DobInput';
import { toast } from 'sonner';

interface QuestionFirstFlowProps {
  onComplete?: (data: {
    fullName: string;
    dob: string;
    birthTime?: string;
    cityName: string;
    selectedTopics: LifeTopic[];
    timeIsUnknown: boolean;
  }) => void;
}

export const QuestionFirstFlow: React.FC<QuestionFirstFlowProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedTopics, setSelectedTopics] = useState<LifeTopic[]>(['career']);
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [timeIsUnknown, setTimeIsUnknown] = useState(false);
  const [cityName, setCityName] = useState('New Delhi');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const toggleTopic = (id: LifeTopic) => {
    if (id === 'all') {
      setSelectedTopics(['all']);
      return;
    }
    const filtered = selectedTopics.filter(t => t !== 'all');
    if (filtered.includes(id)) {
      if (filtered.length > 1) {
        setSelectedTopics(filtered.filter(t => t !== id));
      }
    } else {
      setSelectedTopics([...filtered, id]);
    }
  };

  const handleCityInput = (val: string) => {
    setCityName(val);
    if (!val || val.length < 2) {
      setCitySuggestions([]);
      return;
    }
    const clean = val.toLowerCase();
    const matches = Object.values(CITY_GEO_DATABASE)
      .map(c => `${c.city}, ${c.country}`)
      .filter(name => name.toLowerCase().includes(clean))
      .slice(0, 5);
    setCitySuggestions(matches);
  };

  const handleContinueToBirthData = () => {
    if (selectedTopics.length === 0) {
      toast.error(language === 'hi' ? 'कृपया कम से कम एक विषय चुनें।' : 'Please select at least one topic.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (!fullName.trim()) {
      toast.error(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }
    if (!dob || dob.length < 8) {
      toast.error(language === 'hi' ? 'कृपया अपनी जन्म तिथि दर्ज करें।' : 'Please enter your date of birth.');
      return;
    }
    if (!cityName.trim()) {
      toast.error(language === 'hi' ? 'कृपया अपना जन्म स्थान दर्ज करें।' : 'Please enter your birth city.');
      return;
    }

    setStep(3);
    setIsCalculating(true);

    const payload = {
      fullName: fullName.trim(),
      dob: dob.trim(),
      birthTime: timeIsUnknown ? undefined : birthTime,
      cityName: cityName.trim(),
      selectedTopics,
      timeIsUnknown,
    };

    // Save to localStorage for instant state persistence
    localStorage.setItem('ankjyotish_question_flow', JSON.stringify(payload));
    localStorage.setItem('numerologyFormData', JSON.stringify({
      fullBirthName: fullName.trim(),
      currentName: fullName.trim(),
      dateOfBirth: dob.trim(),
      city: cityName.trim(),
      relation: 'self',
      gender: 'other',
      email: 'guest@ankjyotish.ai',
    }));

    setTimeout(() => {
      if (onComplete) {
        onComplete(payload);
      } else {
        navigate('/report');
      }
    }, 1800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            1
          </div>
          <span className="text-xs font-medium">{language === 'hi' ? 'विषय' : 'Topic'}</span>
        </div>
        <div className="h-0.5 w-12 bg-border" />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            2
          </div>
          <span className="text-xs font-medium">{language === 'hi' ? 'जन्म विवरण' : 'Birth Details'}</span>
        </div>
        <div className="h-0.5 w-12 bg-border" />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            3
          </div>
          <span className="text-xs font-medium">{language === 'hi' ? 'परिणाम' : 'Reading'}</span>
        </div>
      </div>

      {/* SCREEN 1: QUESTION SELECTION */}
      {step === 1 && (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'वैदिक ज्योतिष + अंकशास्त्र' : 'Vedic Astrology + Numerology'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              {language === 'hi' ? 'आज आप क्या जानना चाहते हैं?' : 'What would you like to know today?'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === 'hi'
                ? 'अपने जीवन का वह क्षेत्र चुनें जिस पर आप स्पष्ट मार्गदर्शन चाहते हैं।'
                : 'Select one or more life areas you want clear, direct guidance on.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LIFE_TOPICS_METADATA.map((item) => {
              const isSelected = selectedTopics.includes(item.id);
              const langKey = language === 'hi' ? 'hi' : language === 'hinglish' ? 'hinglish' : 'en';
              return (
                <div
                  key={item.id}
                  onClick={() => toggleTopic(item.id)}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                      : 'border-border hover:border-primary/40 bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-foreground mb-1">
                      {item.title[langKey]}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.subtitle[langKey]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleContinueToBirthData}
              className="px-8 py-6 text-base font-semibold rounded-xl gap-2 shadow-lg shadow-primary/20"
            >
              <span>{language === 'hi' ? 'आगे बढ़ें' : 'Continue to Birth Details'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* SCREEN 2: ESSENTIAL BIRTH DATA */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-display font-bold text-foreground">
              {language === 'hi' ? 'आपके जन्म का सटीक विवरण' : 'Your Essential Birth Details'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {language === 'hi'
                ? 'सटीक वैदिक लग्न, चंद्र राशि और अंकों की गणना के लिए केवल आवश्यक जानकारी।'
                : 'Used strictly to calculate accurate Sidereal planets, Lagna, and numerology cycles.'}
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4 text-primary" />
                <span>{language === 'hi' ? 'पूरा नाम' : 'Full Name'} *</span>
              </Label>
              <Input
                id="fullName"
                placeholder={language === 'hi' ? 'जैसे: राहुल शर्मा' : 'e.g. Rahul Sharma'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob" className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{language === 'hi' ? 'जन्म तिथि' : 'Date of Birth'} *</span>
              </Label>
              <DobInput
                id="dob"
                value={dob}
                onChange={setDob}
                outputFormat="dd/mm/yyyy"
                language={language}
              />
            </div>

            {/* Time of Birth */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="birthTime" className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{language === 'hi' ? 'जन्म समय' : 'Time of Birth'}</span>
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{language === 'hi' ? 'समय मालूम नहीं' : 'Time unknown'}</span>
                  <Switch checked={timeIsUnknown} onCheckedChange={setTimeIsUnknown} />
                </div>
              </div>
              {!timeIsUnknown ? (
                <Input
                  id="birthTime"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="h-11 rounded-xl"
                />
              ) : (
                <p className="text-xs text-primary/80 bg-primary/5 p-3 rounded-xl border border-primary/20">
                  {language === 'hi'
                    ? 'नोट: सटीक समय के बिना सूर्य लग्न और चंद्र स्थिति के आधार पर सटीक विश्लेषण तैयार किया जाएगा।'
                    : 'Note: Without exact time, analysis uses Surya Lagna and Lunar Ephemeris.'}
                </p>
              )}
            </div>

            {/* Birth City */}
            <div className="space-y-2 relative">
              <Label htmlFor="cityName" className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{language === 'hi' ? 'जन्म स्थान / शहर' : 'Birth City / Place'} *</span>
              </Label>
              <Input
                id="cityName"
                placeholder={language === 'hi' ? 'जैसे: New Delhi, Mumbai' : 'e.g. New Delhi, Mumbai, London'}
                value={cityName}
                onChange={(e) => handleCityInput(e.target.value)}
                className="h-11 rounded-xl"
              />
              {citySuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-popover border border-border rounded-xl shadow-lg overflow-hidden">
                  {citySuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCityName(item.split(',')[0]);
                        setCitySuggestions([]);
                      }}
                      className="px-4 py-2.5 text-xs sm:text-sm hover:bg-accent cursor-pointer transition-colors"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="rounded-xl px-5"
            >
              {language === 'hi' ? '← वापस' : '← Back'}
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              className="flex-1 py-6 text-base font-semibold rounded-xl gap-2 shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? 'मेरा व्यक्तिगत विश्लेषण देखें ✨' : 'Reveal My Cosmic Guidance ✨'}</span>
            </Button>
          </div>
        </div>
      )}

      {/* SCREEN 3: CALCULATION & SYNTHESIS ANIMATION */}
      {step === 3 && isCalculating && (
        <div className="text-center space-y-6 py-16 animate-fade-in max-w-md mx-auto">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
            <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin flex items-center justify-center bg-primary/5">
              <Compass className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold text-foreground">
              {language === 'hi' ? 'वैदिक गणना और अंक विश्लेषण जारी है...' : 'Synthesizing Vedic Chart & Numerology...'}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {language === 'hi'
                ? 'लाहिड़ी अयनांश, लग्न, चंद्र नक्षत्र और लो-शू ग्रिड का समन्वय किया जा रहा है।'
                : 'Computing Sidereal longitudes, Lagna, Vimshottari dasha, and Lo Shu grid.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionFirstFlow;
