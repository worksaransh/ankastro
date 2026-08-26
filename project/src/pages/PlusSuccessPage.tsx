import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Crown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type State = 'verifying' | 'active' | 'pending';

export default function PlusSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get('order_id');
  const { language } = useLanguage();
  const [state, setState] = useState<State>('verifying');
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (!orderId) { setState('pending'); return; }
    let on = true;
    (async () => {
      try {
        const { data } = await supabase.from('subscriptions')
          .select('status, expires_at, plan').eq('cashfree_order_id', orderId).maybeSingle();
        if (!on) return;
        if (data?.status === 'active') setState('active');
        else if (tries < 5) { setTimeout(() => setTries((t) => t + 1), 3000); }
        else setState('pending');
      } catch { if (on && tries >= 5) setState('pending'); }
    })();
    return () => { on = false; };
  }, [orderId, tries]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-cosmic/5 px-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-6">
          {state === 'verifying' && (<>
            <Loader2 className="w-10 h-10 text-primary mx-auto mb-4 animate-spin" />
            <p className="font-display text-xl">{language === 'hi' ? 'पुष्टि हो रही है…' : 'Confirm ho raha hai…'}</p>
          </>)}
          {state === 'active' && (<>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold mb-3"><Crown className="w-3.5 h-3.5" /> PLUS ACTIVE</div>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <p className="font-display text-2xl mb-2">{language === 'hi' ? 'स्वागत है! 🎉' : 'Welcome to Plus! 🎉'}</p>
            <p className="text-sm text-muted-foreground mb-5">
              {language === 'hi' ? 'अब आपको रोज़ का भाग्यफल, मासिक रिपोर्ट और असीमित AI चैट मिलेगी।' : language === 'en' ? 'You now get daily forecasts, monthly reports & unlimited AI chat.' : 'Ab aapko roz ka bhagyafal, monthly report aur unlimited AI chat milegi.'}
            </p>
            <Link to="/dashboard"><Button variant="cosmic" className="w-full">{language === 'hi' ? 'डैशबोर्ड देखें' : 'Go to Dashboard'}</Button></Link>
          </>)}
          {state === 'pending' && (<>
            <Loader2 className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <p className="font-display text-xl mb-2">{language === 'hi' ? 'भुगतान प्रोसेस हो रहा है' : 'Payment process ho raha hai'}</p>
            <p className="text-sm text-muted-foreground mb-5">{language === 'hi' ? 'कुछ मिनट लग सकते हैं। डैशबोर्ड पर स्टेटस दिखेगा।' : 'Kuch minute lag sakte hain. Dashboard par status dikhega.'}</p>
            <Link to="/dashboard"><Button variant="outline" className="w-full">Dashboard</Button></Link>
          </>)}
        </CardContent>
      </Card>
    </div>
  );
}
