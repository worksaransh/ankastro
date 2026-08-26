import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Download, X, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  en: {
    title: 'Install AnkJyotish App',
    desc: 'Add to your home screen for instant daily forecasts, remedies, and tool access.',
    button: 'Install App',
  },
  hi: {
    title: 'AnkJyotish ऐप इंस्टॉल करें',
    desc: 'दैनिक राशिफल, उपायों और टूल तक तुरंत पहुंच के लिए अपने होम स्क्रीन पर जोड़ें।',
    button: 'ऐप इंस्टॉल करें',
  },
  hinglish: {
    title: 'AnkJyotish App Install Karein',
    desc: 'Daily forecasts, remedies aur tool access ke liye apne home screen par add karein.',
    button: 'Install Karein',
  },
};

export default function PWAInstallPrompt() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user dismissed the prompt in this session/device
    const isDismissed = localStorage.getItem('pwa_prompt_dismissed') === 'true';
    if (isDismissed) return;

    // Check if app is already running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser default mini-infobar
      e.preventDefault();
      // Store event to trigger later
      setDeferredPrompt(e);
      // Show the install UI banner
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also double check if we can show it on iOS manually or check if beforeinstallprompt was already captured
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show native prompt
    deferredPrompt.prompt();
    
    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    // Reset prompt state
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    // Prevent showing again for 7 days
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-[999] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <Card className="border border-primary/30 bg-background/80 backdrop-blur-md glow-gold-card relative overflow-hidden shadow-2xl">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-divine/5 to-transparent pointer-events-none" />
        
        <CardContent className="p-4 sm:p-5 flex items-start gap-3 relative">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/25 shrink-0 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          
          <div className="space-y-1.5 pr-6">
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
              {t.title}
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            </h4>
            <p className="text-xs text-gray-300 leading-normal">
              {t.desc}
            </p>
            <div className="flex items-center gap-2 pt-1.5">
              <Button 
                onClick={handleInstallClick}
                size="sm"
                className="bg-gradient-to-r from-primary to-divine hover:from-primary/90 hover:to-divine/90 text-xs gap-1.5 h-8 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                {t.button}
              </Button>
            </div>
          </div>
          
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
