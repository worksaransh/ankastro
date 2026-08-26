import React from 'react';
import { RecommendationItem } from '@/lib/recommendationHelper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RecommendationCardProps {
  item: RecommendationItem;
  sourcePage?: string;
  className?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  item,
  sourcePage = 'unknown',
  className = '',
}) => {
  const handleClick = async () => {
    try {
      // Log click telemetry
      await supabase.from('recommendation_clicks').insert({
        item_id: item.id,
        slug: item.slug,
        source_page: sourcePage,
        clicked_at: new Date().toISOString(),
      });
    } catch {
      /* ignore telemetry errors */
    }

    // Open target link via redirect handler or direct buy link
    const target = item.buy_link.startsWith('http')
      ? item.buy_link
      : `/go/${item.slug}`;
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`group relative rounded-2xl bg-gradient-to-br from-[#18132d] via-[#140f26] to-[#0c0919] border border-amber-500/20 hover:border-amber-400/50 p-4 sm:p-5 shadow-xl transition-all duration-300 hover:shadow-amber-500/10 flex flex-col sm:flex-row items-center gap-4 ${className}`}
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <Badge
          variant="secondary"
          className="absolute top-1.5 left-1.5 bg-amber-500/90 text-black text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
        >
          {item.category}
        </Badge>
      </div>

      {/* Details */}
      <div className="flex-1 text-center sm:text-left space-y-1.5">
        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
          <h4 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors">
            {item.name}
          </h4>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Certified & Energized
          </span>
        </div>

        <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
          {item.short_description}
        </p>
      </div>

      {/* CTA Button */}
      <div className="shrink-0 w-full sm:w-auto">
        <Button
          onClick={handleClick}
          size="sm"
          className="w-full sm:w-auto gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-md shadow-amber-500/20 rounded-xl px-5 h-10"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Buy Now</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </Button>
      </div>
    </div>
  );
};

export default RecommendationCard;
