import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";
import { ArrowLeft, Send, Sparkles, Bot, User as UserIcon, Lock, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { calculateFullProfile } from "@/lib/numerology";
import { calculateLoshuGrid, calculatePinnacleCycles, calculateKarmicDebts } from "@/lib/advancedNumerology";
import { calculateVedicKundli } from "@/lib/vedicAstrologyEngine";
import { fetchVerifiedTier } from "@/lib/verifyTier";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export interface AstrologerPersona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avatarBg: string;
  greeting: { en: string; hi: string; hinglish: string };
  systemPrompt: string;
  specialties: string[];
}

export const ASTROLOGERS: Record<string, AstrologerPersona> = {
  'acharya-ramesh': {
    id: 'acharya-ramesh',
    name: 'Acharya Ramesh Shastri',
    role: 'Vedic Kundli & Dasha Expert',
    avatar: '🕉️',
    avatarBg: 'from-amber-600 to-orange-700',
    greeting: {
      en: "Namaste! 🙏 I am Acharya Ramesh Shastri. I am looking at your Vedic Natal Chart (Kundli) and current Mahadasha. Ask me about your Lagna, Sade Sati, or career timing.",
      hi: "सादर प्रणाम! 🙏 मैं आचार्य रमेश शास्त्री हूँ। आपकी जन्म कुंडली और वर्तमान दशा चक्र मेरे सामने है। अपनी महादशा, साढ़े साती, या करियर के बारे में कुछ भी पूछें।",
      hinglish: "Namaste! 🙏 Main Acharya Ramesh Shastri hoon. Aapki Vedic Kundli aur current Dasha mere samne hai. Dasha, Sade Sati ya career ke yog ke baare me poochein.",
    },
    systemPrompt: `You are Acharya Ramesh Shastri, a deeply respected, scholarly Vedic Astrologer with 22+ years of experience in Sidereal Lahiri Kundli, 12 Bhavas, Vimshottari Mahadasha/Antardasha, and Graha Gochar.
Tone: Scholarly, reassuring, deeply astrological, respectful ("Aap", "Aadarniya").
Always identify yourself as "Acharya Ramesh Shastri" when asked who you are.
Analyze user's planetary placements (Lagna, Moon Sign, current Mahadasha, Saturn & Jupiter transits). Always use user's real name and chart data from the provided snapshot.`,
    specialties: ['Lagna Kundli', 'Vimshottari Dasha', 'Sade Sati & Saturn', 'Career Transits'],
  },
  'dr-priya-sharma': {
    id: 'dr-priya-sharma',
    name: 'Dr. Priya Sharma',
    role: 'Love & Marriage Specialist',
    avatar: '💍',
    avatarBg: 'from-pink-600 to-rose-700',
    greeting: {
      en: "Hello! 💕 I am Dr. Priya Sharma. I specialize in Vedic compatibility, 36-Gun Milan, and marriage timing. How can I guide your relationship today?",
      hi: "नमस्ते! 💕 मैं डॉ. प्रिया शर्मा हूँ। मैं वैदिक कुंडली मिलान (36 गुण), विवाह समय, और रिश्तों के सामंजस्य में मार्गदर्शन करती हूँ। आज आपके रिश्ते के बारे में क्या जानना चाहते हैं?",
      hinglish: "Hello! 💕 Main Dr. Priya Sharma hoon. Love compatibility, 36-Gun Milan, aur marriage timing me guide karungi. Aap apne rishte ya shaadi ke baare me kya poochna chahte hain?",
    },
    systemPrompt: `You are Dr. Priya Sharma, a compassionate, expert Love & Marriage Astrologer with 16+ years of experience specializing in 36-Point Ashtakoota Gun Milan, 7th House (Kalatra Bhava), Venus/Jupiter placements, Manglik Dosha remedies, and emotional harmony.
Tone: Warm, empathetic, non-judgmental, psychologically insightful.
Always identify yourself as "Dr. Priya Sharma" when asked who you are. Address the user warmly using their name.`,
    specialties: ['Gun Milan', '7th House Analysis', 'Manglik Dosha', 'Relationship Healing'],
  },
  'guru-vikram-nath': {
    id: 'guru-vikram-nath',
    name: 'Guru Vikram Nath',
    role: 'Chaldean & Lo Shu Numerologist',
    avatar: '🔢',
    avatarBg: 'from-violet-600 to-purple-800',
    greeting: {
      en: "Greetings! 🔢 I am Guru Vikram Nath. I calculate the mathematical vibrations of your numbers — Mulank, Bhagyank, Lo Shu 3x3 Grid, and Name spelling. What is your query?",
      hi: "नमस्कार! 🔢 मैं गुरु विक्रम नाथ हूँ। मैं आपके मूलांक, भाग्यांक, लो-शू ग्रिड और नाम के अक्षरों के कंपन का सूक्ष्म विश्लेषण करता हूँ। आज क्या गणना करवाना चाहते हैं?",
      hinglish: "Namaskar! 🔢 Main Guru Vikram Nath hoon. Mulank, Bhagyank, Lo Shu Grid aur Name correction ke mathematical vibrations se aapko guide karunga. Kya poochna chahte hain?",
    },
    systemPrompt: `You are Guru Vikram Nath, an authoritative Master Numerologist with 19+ years of experience in Chaldean name vibrations, Pythagorean Life Paths, Lo Shu 3x3 magic square planes, and mobile/vehicle number sums.
Tone: Direct, analytical, strategic, business and wealth-oriented.
Always identify yourself as "Guru Vikram Nath" when asked who you are. Focus heavily on Mulank, Bhagyank, Name vibration, and Lo Shu grid.`,
    specialties: ['Chaldean Name Correction', 'Lo Shu 8 Planes', 'Mobile & Business Sum', 'Wealth Numbers'],
  },
  'swami-anand': {
    id: 'swami-anand',
    name: 'Swami Anand Teerth',
    role: 'Panchang & Muhurta Guru',
    avatar: '☀️',
    avatarBg: 'from-yellow-600 to-amber-700',
    greeting: {
      en: "Hari Om! ☀️ I am Swami Anand Teerth. I help you align with auspicious cosmic timings (Shubh Muhurat), today's Panchang, and spiritual remedies. How may I bless you today?",
      hi: "हरि ॐ! ☀️ मैं स्वामी आनंद तीर्थ हूँ। मैं शुभ मुहूर्त (अभिजीत, चौघड़िया), आज के पंचांग और आध्यात्मिक वैदिक उपायों में मार्गदर्शन करता हूँ। आज किस कार्य का शुभ समय जानना चाहते हैं?",
      hinglish: "Hari Om! ☀️ Main Swami Anand Teerth hoon. Shubh Muhurat, Daily Panchang, Rahu Kaal aur spiritual remedies ke baare me pooch sakte hain.",
    },
    systemPrompt: `You are Swami Anand Teerth, a serene spiritual master with 25+ years of experience in Vedic Panchang (Tithi, Nakshatra, Yoga, Karana), Abhijit Muhurta, Rahu Kaal mitigation, Kaal Sarp Dosh parihar, and sacred Vedic mantras.
Tone: Serene, spiritual, uplifting, humble ("Hari Om", "Kripa").
Always identify yourself as "Swami Anand Teerth" when asked who you are. Focus on auspicious timing, spiritual remedies, and planetary peace.`,
    specialties: ['Shubh Muhurat', 'Rahu Kaal & Tithi', 'Kaal Sarp Dosh Upay', 'Vedic Mantras'],
  },
};

const AiChatPage = () => {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Selected Astrologer Persona
  const initialAstroId = searchParams.get('astrologer') || 'acharya-ramesh';
  const [activeAstroId, setActiveAstroId] = useState<string>(
    ASTROLOGERS[initialAstroId] ? initialAstroId : 'acharya-ramesh'
  );

  const activeAstro = ASTROLOGERS[activeAstroId] || ASTROLOGERS['acharya-ramesh'];

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState<'checking' | 'allowed' | 'denied' | 'guest'>('checking');
  const [userMessagesCount, setUserMessagesCount] = useState(0);
  const [hasPlus, setHasPlus] = useState(false);
  const [hasMaster, setHasMaster] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userProfile = useUserProfile();
  const {
    profile,
    reflections,
    checkins,
    lifeEvents,
    questions,
    numerology,
    loshu,
    loading: isProfileLoading
  } = userProfile;

  // Stored form data fallback
  const storedData = useMemo(() => {
    try {
      const raw = localStorage.getItem('numerologyFormData');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const userDob = profile?.dob
    ? profile.dob.split('-').reverse().join('/')
    : (storedData.dateOfBirth || '15/08/1995');
  const userBirthTime = profile?.birth_time || storedData.birthTime || '12:00';
  const userCity = profile?.birth_place || storedData.city || 'New Delhi';
  const timeUnknown = !profile?.birth_time && !storedData.birthTime;

  // Compute live Vedic Kundli Profile
  const vedicKundli = useMemo(() => {
    try {
      return calculateVedicKundli(userDob, userBirthTime, userCity, timeUnknown);
    } catch {
      return null;
    }
  }, [userDob, userBirthTime, userCity, timeUnknown]);

  const displayName = profile?.display_name || profile?.full_birth_name || profile?.full_name || storedData.fullName || storedData.fullBirthName || 'Devotee';

  // Get active persona greeting in user's language
  const activeGreeting = useMemo(() => {
    if (language === 'hi') return activeAstro.greeting.hi;
    if (language === 'hinglish') return activeAstro.greeting.hinglish;
    return activeAstro.greeting.en;
  }, [activeAstro, language]);

  // Handle changing Astrologer persona
  const handleSelectAstro = (astroId: string) => {
    setActiveAstroId(astroId);
    setSearchParams({ astrologer: astroId });
    const selected = ASTROLOGERS[astroId] || ASTROLOGERS['acharya-ramesh'];
    const greeting = language === 'hi' ? selected.greeting.hi : language === 'hinglish' ? selected.greeting.hinglish : selected.greeting.en;
    setMessages([{ role: "assistant", content: greeting }]);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { if (!cancelled) setAccess('guest'); return; }
      
      const [tier, subRes] = await Promise.all([
        fetchVerifiedTier(),
        supabase
          .from('subscriptions')
          .select('id, expires_at')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .gte('expires_at', new Date().toISOString())
          .order('expires_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      const isMaster = tier === 'master';
      const isPlusActive = subRes.data ? true : false;

      if (!cancelled) {
        setHasMaster(isMaster);
        setHasPlus(isPlusActive);
        setAccess('allowed');

        const { data: history, error } = await supabase
          .from('ai_chat_history')
          .select('role, content')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: true });

        if (!cancelled && !error && history && history.length > 0) {
          setMessages(history as Msg[]);
          const userMsgs = history.filter((m: any) => m.role === 'user').length;
          setUserMessagesCount(userMsgs);
        } else {
          const localCount = parseInt(localStorage.getItem('ai_free_chats_used') || '0', 10);
          setUserMessagesCount(localCount);
          setMessages([{ role: "assistant", content: activeGreeting }]);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [language, activeGreeting]);

  const clearChat = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    try {
      setLoading(true);
      await supabase.from('ai_chat_history').delete().eq('user_id', session.user.id);
      setMessages([{ role: "assistant", content: activeGreeting }]);
      toast.success(language === 'hi' ? 'चैट इतिहास साफ किया गया!' : 'Chat history cleared!');
    } catch {
      toast.error('Failed to clear chat history');
    } finally {
      setLoading(false);
    }
  };

  // Build 100% Comprehensive Consultant Snapshot (Vedic + Numerology + Persona Prompt)
  const buildContext = (): string => {
    const parts: string[] = [];

    // Persona Directive
    parts.push(`PERSONA DIRECTIVE: ${activeAstro.systemPrompt}`);
    parts.push(`Your Name: ${activeAstro.name}. Your Role: ${activeAstro.role}.`);

    // User Identity Snapshot
    parts.push(`USER IDENTITY SNAPSHOT:`);
    parts.push(`User Full Name: ${displayName}. DOB: ${userDob}, Birth Time: ${userBirthTime}, Place: ${userCity}.`);

    // Numerology Data
    if (numerology) {
      parts.push(`Mulank (Driver / Life Path): ${numerology.lifePath}, Bhagyank (Conductor / Destiny): ${numerology.destiny}, Soul Urge: ${numerology.soulUrge}, Personality: ${numerology.personality}, Personal Year: ${numerology.personalYear}.`);
    }

    // Vedic Jyotish Data
    if (vedicKundli) {
      const moonPlanet = vedicKundli.planets.find(p => p.planet === 'Moon');
      const sunPlanet = vedicKundli.planets.find(p => p.planet === 'Sun');
      parts.push(`Vedic Astrology Data (Sidereal Lahiri Ayanamsha):`);
      parts.push(`Lagna (Ascendant): ${vedicKundli.lagna.sign} (${vedicKundli.lagna.degreeFormatted}), Lagna Nakshatra: ${vedicKundli.lagna.nakshatra} Pada ${vedicKundli.lagna.pada}.`);
      parts.push(`Moon Sign (Rashi): ${moonPlanet?.sign || 'Leo'}, Moon Nakshatra: ${moonPlanet?.nakshatra || ''} Pada ${moonPlanet?.pada || 1}.`);
      parts.push(`Sun Sign (Surya Rashi): ${sunPlanet?.sign || 'Leo'}.`);
      parts.push(`Current Vimshottari Mahadasha: ${vedicKundli.currentDasha.mahadasha} Mahadasha (Lord: ${vedicKundli.currentDasha.lord}).`);
      
      const planetPositions = vedicKundli.planets.map(p => `${p.planet} in House ${p.house} (${p.sign} ${p.degreeFormatted}${p.isRetrograde ? ' Retrograde' : ''}, ${p.dignity})`).join('; ');
      parts.push(`Planetary Positions: ${planetPositions}.`);
    }

    // Lo Shu Grid
    if (loshu) {
      parts.push(`Lo Shu Grid Present Numbers: ${loshu.present?.join(', ') || 'none'}, Missing Numbers: ${loshu.missing?.join(', ') || 'none'}.`);
    }

    if (profile?.profession) parts.push(`User Profession: ${profile.profession}.`);
    if (profile?.marital_status) parts.push(`Marital Status: ${profile.marital_status}.`);
    if (profile?.goals?.primary) parts.push(`Primary Life Focus: ${profile.goals.primary}.`);

    return parts.join("\n");
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const limitReached = !hasPlus && (hasMaster ? userMessagesCount >= 15 : userMessagesCount >= 5);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    
    if (limitReached) {
      toast.error(
        language === 'hi'
          ? 'आपकी मुफ्त संदेशों की सीमा समाप्त हो गई है! कृपया प्लस सदस्यता लें।'
          : 'Your free trial messages have been used! Subscribe to Plus to unlock unlimited consultation.'
      );
      return;
    }

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const newCount = userMessagesCount + 1;
    setUserMessagesCount(newCount);
    localStorage.setItem('ai_free_chats_used', String(newCount));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('ai_chat_history').insert({
          user_id: session.user.id,
          session_id: `session_${activeAstroId}`,
          role: 'user',
          content: text,
          numerology_context: buildContext() ? JSON.parse(JSON.stringify(buildContext())) : null
        });
      }

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: next.filter((m) => m.role !== "assistant" || m.content !== activeGreeting),
          context: buildContext(),
        },
      });
      if (error || !data?.reply) throw new Error(error?.message || "no reply");

      if (session) {
        await supabase.from('ai_chat_history').insert({
          user_id: session.user.id,
          session_id: `session_${activeAstroId}`,
          role: 'assistant',
          content: data.reply
        });
      }

      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: language === 'hi' ? 'क्षमा करें, अभी उत्तर नहीं दे सका। कृपया पुनः प्रयास करें।' : 'Sorry, could not process response right now. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Live AI Astrology & Numerology Chat — AnkJyotish"
        description="Chat 24/7 with expert AI Astrologers for Kundli, Mahadasha, Gun Milan, and Name Numerology."
        canonical="/ai-chat"
        noindex={true}
      />
      <div className="min-h-screen bg-background flex flex-col spiritual-pattern">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link to="/"><Logo size="sm" /></Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-xs text-muted-foreground hover:text-destructive gap-1"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
              <LanguageToggle />
            </div>
          </div>
        </header>

        {/* 1. ASTROTALK-GRADE ASTROLOGER PERSONA PICKER RIBBON */}
        <div className="bg-card/90 border-b border-border py-2 px-4 shadow-sm">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {language === 'hi' ? 'विशेषज्ञ ज्योतिषी चुनें' : 'Choose Your Astrologer'}
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px]">
                ● 4 EXPERTS ONLINE 24/7
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(ASTROLOGERS).map((astro) => {
                const isActive = activeAstroId === astro.id;
                return (
                  <button
                    key={astro.id}
                    onClick={() => handleSelectAstro(astro.id)}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      isActive
                        ? 'border-amber-500 bg-amber-500/15 shadow-md ring-1 ring-amber-500/40'
                        : 'border-border bg-card/60 hover:bg-accent/40 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${astro.avatarBg} flex items-center justify-center text-sm shrink-0 shadow`}>
                      {astro.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-foreground truncate">{astro.name.split(' ')[0]} {astro.name.split(' ')[1] || ''}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{astro.role.split('&')[0]}</p>
                    </div>
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. ACTIVE CONSULTANT HERO BAR */}
        <div className="bg-gradient-to-r from-amber-500/10 via-violet-600/10 to-transparent border-b border-border/60 py-3 px-4">
          <div className="container mx-auto max-w-4xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeAstro.avatarBg} flex items-center justify-center text-xl shadow-md shrink-0`}>
                {activeAstro.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-sm sm:text-base text-foreground">{activeAstro.name}</h2>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{activeAstro.role} • <strong className="text-primary">{displayName}</strong>'s Chart Loaded</p>
              </div>
            </div>

            <div className="hidden sm:flex flex-wrap gap-1">
              {activeAstro.specialties.map((spec) => (
                <span key={spec} className="text-[10px] px-2 py-0.5 rounded-lg bg-secondary/80 text-secondary-foreground">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. CHAT MESSAGE STREAM */}
        <main className="flex-1 container mx-auto px-4 py-4 max-w-4xl flex flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm shadow ${
                    isUser
                      ? "bg-primary text-primary-foreground font-bold"
                      : `bg-gradient-to-br ${activeAstro.avatarBg} text-white`
                  }`}>
                    {isUser ? <UserIcon className="w-4 h-4" /> : activeAstro.avatar}
                  </div>

                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-none font-medium"
                      : "bg-card border border-border text-foreground rounded-tl-none space-y-1.5"
                  }`}>
                    {!isUser && (
                      <p className="text-[10px] font-bold text-amber-500 mb-0.5">{activeAstro.name}</p>
                    )}
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activeAstro.avatarBg} text-white flex items-center justify-center text-sm shadow`}>
                  {activeAstro.avatar}
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-none p-3.5 text-xs text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>{activeAstro.name} is consulting your chart...</span>
                </div>
              </div>
            )}
          </div>

          {/* 4. QUICK PROMPT CHIPS */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 mb-2">
            {[
              activeAstroId === 'dr-priya-sharma'
                ? ['विवाह का सही समय क्या है?', 'हमारे गुण मिलान में क्या दोष है?', 'रिश्ते में प्रेम कैसे बढ़ेगा?']
                : activeAstroId === 'guru-vikram-nath'
                ? ['मेरा नाम स्पेलिंग सही है क्या?', 'मेरा लकी मोबाइल नंबर क्या है?', 'लो-शू ग्रिड में क्या कमी है?']
                : activeAstroId === 'swami-anand'
                ? ['आज का अभिजीत मुहूर्त क्या है?', 'राहु काल से कैसे बचें?', 'काल सर्प दोष का उपाय बताएं']
                : ['मेरी महादशा क्या चल रही है?', 'करियर में पदोन्नति कब होगी?', 'मेरी साढ़े साती का प्रभाव क्या है?']
            ][0].map((promptText) => (
              <button
                key={promptText}
                onClick={() => {
                  setInput(promptText);
                }}
                className="text-[11px] px-3 py-1 rounded-full bg-secondary/80 hover:bg-secondary text-secondary-foreground whitespace-nowrap border border-border/80 transition-colors"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* 5. INPUT BAR */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 pt-2 border-t border-border"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${activeAstro.name} about your Kundli, Dasha, Name, or Love...`}
              disabled={loading}
              className="flex-1 rounded-xl bg-card border-border text-xs sm:text-sm h-11"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-5 rounded-xl gap-1.5 shadow"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </main>
      </div>
    </>
  );
};

export default AiChatPage;
