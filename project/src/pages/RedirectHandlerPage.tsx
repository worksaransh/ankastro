import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecommendationBySlug } from '@/lib/recommendationHelper';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2 } from 'lucide-react';

export default function RedirectHandlerPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!slug) {
      navigate('/');
      return;
    }

    const processRedirect = async () => {
      const item = await getRecommendationBySlug(slug);
      if (!item || !item.buy_link) {
        setErrorMsg('Recommendation link not found');
        setTimeout(() => navigate('/'), 2500);
        return;
      }

      // Log click telemetry to DB asynchronously
      try {
        await supabase.from('recommendation_clicks').insert({
          slug: item.slug,
          item_id: item.id,
          clicked_at: new Date().toISOString(),
        });
      } catch {
        /* ignore */
      }

      // Perform redirect
      window.location.href = item.buy_link;
    };

    processRedirect();
  }, [slug, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0714] text-white p-4">
      <div className="text-center space-y-4 max-w-sm">
        <Sparkles className="w-12 h-12 text-amber-400 animate-pulse mx-auto" />
        <h2 className="text-xl font-display font-bold">Redirecting to Partner Store...</h2>
        <p className="text-xs text-gray-400">
          Connecting you safely to certified numerology gemstone & yantra store.
        </p>
        {errorMsg ? (
          <p className="text-xs text-rose-400">{errorMsg}</p>
        ) : (
          <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
        )}
      </div>
    </div>
  );
}
