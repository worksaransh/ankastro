import { useEffect, useState } from 'react';

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent browser's automatic installation prompt
      e.preventDefault();
      // Stash the event so it can be triggered manually by our UI
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If already running in standalone display mode, disable install options
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    // Reset stashed prompt
    setDeferredPrompt(null);
    setIsInstallable(false);
    return outcome === 'accepted';
  };

  return { isInstallable, installApp };
};
