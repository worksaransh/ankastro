import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, MessageCircle, Bot, User as UserIcon, Send, X, Lock, Crown, Star, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const FREE_LIMIT = 3;

export const AiChatWidget: React.FC = () => {
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const isHinglish = language === 'hinglish';
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userMsgsCount, setUserMsgsCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('ai_free_chats_used') || '0', 10);
  });
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userProfile = useUserProfile();
  const { profile, numerology } = userProfile;

  // Do not show floating widget on full /ai-chat page to avoid double UI
  if (location.pathname === '/ai-chat') return null;

  useEffect(() => {
    // Initial greeting
    const greeting = isHi
      ? 'नमस्ते! 🙏 मैं आपका AI अंक ज्योतिष मार्गदर्शक हूँ। अपने मूलांक, शुभ अंक या उपाय के बारे में कुछ भी पूछें!'
      : isHinglish
      ? 'Namaste! 🙏 Main aapka AI numerology guide hoon. Apne Mulank, lucky numbers ya remedies ke baare mein kuch bhi poochein!'
      : 'Namaste! 🙏 I am your AI Numerology Guide. Ask me anything about your Mulank, lucky numbers, or remedies!';

    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [language]);

  useEffect(() => {
    // Check subscription status
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .gte('expires_at', new Date().toISOString())
          .maybeSingle();

        if (sub) {
          setIsSubscriber(true);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }, [messages, loading, isOpen]);

  const remainingFree = Math.max(0, FREE_LIMIT - userMsgsCount);
  const isLimitReached = !isSubscriber && remainingFree <= 0;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (isLimitReached) {
      setShowUpgradeModal(true);
      return;
    }

    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    const newCount = userMsgsCount + 1;
    setUserMsgsCount(newCount);
    localStorage.setItem('ai_free_chats_used', String(newCount));

    try {
      // Build context if user profile exists
      let contextStr: string | undefined;
      if (profile && profile.dob) {
        contextStr = `Name: ${profile.full_birth_name || profile.full_name || 'User'}, DOB: ${profile.dob}. Mulank: ${numerology?.lifePath || ''}, Destiny: ${numerology?.destiny || ''}.`;
      }

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: next.filter((m) => m.role !== 'assistant' || !m.content.includes('Namaste')),
          context: contextStr,
        },
      });

      if (error || !data?.reply) throw new Error(error?.message || 'No response');

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);

      // Trigger upgrade popup right after using the 3rd free chat
      if (!isSubscriber && newCount >= FREE_LIMIT) {
        setTimeout(() => setShowUpgradeModal(true), 1200);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isHi
            ? 'क्षमा करें, अभी उत्तर नहीं दे सका। कृपया फिर प्रयास करें।'
            : 'Sorry, I could not respond right now. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[998]">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-primary via-violet-600 to-amber-500 text-white font-medium text-xs sm:text-sm shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-300/30"
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="font-semibold tracking-wide flex items-center gap-1.5">
              {isHi ? 'AI ज्योतिष चैट' : 'Ask AI Astrologer'}
              {!isSubscriber && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {remainingFree} {isHi ? 'मुफ्त' : 'Free'}
                </span>
              )}
            </span>
          </button>
        ) : (
          /* Floating AI Chatbox Drawer */
          <Card className="w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-[#0e081e] border border-primary/30 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-slide-up">
            {/* Widget Header */}
            <div className="p-3.5 bg-gradient-to-r from-primary/20 via-violet-900/30 to-amber-500/10 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/20 border border-primary/30 text-amber-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                    AnkJyotish AI Assistant
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    {!isSubscriber ? (
                      <span className="text-amber-400 font-medium">
                        {remainingFree > 0
                          ? (isHi ? `${remainingFree} फ्री संदेश शेष` : `${remainingFree} Free Credits Left`)
                          : (isHi ? 'फ्री ट्रायल समाप्त' : 'Free Trial Limit Reached')}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">👑 Plus Member Active</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs leading-relaxed">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl ${
                      m.role === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 justify-start items-center text-muted-foreground">
                  <Bot className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-[11px] animate-pulse">Thinking...</span>
                </div>
              )}
            </div>

            {/* Upgrade Notification Banner inside Drawer if Limit Reached */}
            {isLimitReached && (
              <div className="p-3 bg-amber-500/10 border-t border-amber-500/20 text-center space-y-2">
                <p className="text-[11px] font-medium text-amber-300">
                  {isHi
                    ? '🔒 आपकी 3 फ्री चैट की सीमा समाप्त हो गई है!'
                    : '🔒 You have used your 3 Free AI Chat credits!'}
                </p>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/pricing');
                  }}
                  size="sm"
                  className="w-full h-8 text-xs bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold gap-1.5 shadow-md"
                >
                  <Crown className="w-3.5 h-3.5" />
                  {isHi ? 'अनलिमिटेड चैट अनलॉक करें (₹99/माह)' : 'Unlock Unlimited AI Chat (₹99/mo)'}
                </Button>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 border-t border-white/10 bg-[#07020f] flex gap-2 items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  isLimitReached
                    ? (isHi ? 'सीमा समाप्त! प्लान देखें...' : 'Limit reached! Upgrade...')
                    : (isHi ? 'मूलांक, शुभ रंग पूछें...' : 'Ask about your Mulank, lucky days...')
                }
                disabled={loading || isLimitReached}
                className="h-9 text-xs bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim() || isLimitReached}
                size="sm"
                className="h-9 px-3 bg-primary hover:bg-primary/90 text-white shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Upgrade Modal / Popup */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md bg-[#110b24] border border-amber-400/30 text-white rounded-2xl shadow-2xl p-6 text-center">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
              <Crown className="w-8 h-8 text-black" />
            </div>
            <DialogTitle className="text-xl font-display font-bold text-white text-center">
              {isHi ? '✨ 3 फ्री AI चैट सीमा समाप्त!' : '✨ 3 Free AI Chats Used!'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-center">
            <p className="text-sm text-gray-300 leading-relaxed">
              {isHi
                ? 'आपने अपने 3 फ्री AI चैट संदेशों का उपयोग कर लिया है। असीमित AI अंक ज्योतिष चैट और दैनिक भविष्यफल अनलॉक करने के लिए अंकज्योतिष प्लस जॉइन करें।'
                : 'You have experienced the power of your personalized AI Numerologist! Upgrade to AnkJyotish Plus (₹99/mo) for unlimited AI Astro Chat.'}
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{isHi ? 'प्लस सदस्यता लाभ:' : 'What you get with Plus Pass:'}</span>
              </div>
              <ul className="space-y-1.5 text-gray-300 pl-6 list-disc">
                <li>{isHi ? 'असीमित AI अंकज्योतिष चैट' : 'Unlimited AI Numerology Chat'}</li>
                <li>{isHi ? 'दैनिक भाग्यशाली अंक, रंग और समय' : 'Daily Lucky Numbers, Colors & Timings'}</li>
                <li>{isHi ? 'सभी विशिष्ट रिपोर्ट्स पर 50% छूट' : '50% Member Discount on all reports'}</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={() => {
                setShowUpgradeModal(false);
                setIsOpen(false);
                navigate('/pricing');
              }}
              size="lg"
              className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold text-sm h-11 gap-2 shadow-lg shadow-amber-500/20"
            >
              <Crown className="w-4 h-4" />
              {isHi ? 'अनलॉक अंकज्योतिष प्लस (₹99/माह)' : 'Unlock Plus Membership (₹99/mo)'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUpgradeModal(false)}
              className="text-gray-400 hover:text-white"
            >
              {isHi ? 'बाद में' : 'Maybe Later'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiChatWidget;
