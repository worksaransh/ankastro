import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Recommendation } from '@/lib/recommendations';

interface RecommendationsProps {
  recommendations: Recommendation[];
  language: string;
  onDismiss: (key: string) => void;
  onClick: (key: string) => void;
}

const IconWrapper = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Sparkles className={className} />;
  return <IconComponent className={className} />;
};

export const Recommendations = ({
  recommendations,
  language,
  onDismiss,
  onClick,
}: RecommendationsProps) => {
  const getLabel = (obj: any) => {
    return obj[language] || obj['en'] || '';
  };

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mb-6 sm:mb-8 animate-fade-in">
      <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        {language === 'hi'
          ? 'आपके लिए ब्रह्मांडीय अनुशंसाएं'
          : language === 'hinglish'
          ? 'Apke Liye Cosmic Recommendations'
          : 'Cosmic Recommendations for You'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendations.slice(0, 4).map((reco) => (
          <Card
            key={reco.key}
            className="glass-card-mystical border-primary/20 bg-background/50 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
          >
            {/* Dismiss button */}
            <button
              onClick={() => onDismiss(reco.key)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 z-10"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <IconWrapper name={reco.icon} className="w-5 h-5" />
                </div>
                <div className="space-y-1 pr-6 text-left">
                  <h4 className="font-display font-bold text-base text-white">
                    {getLabel(reco.title)}
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {getLabel(reco.reason)}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex">
                <Button
                  variant="mystical"
                  size="sm"
                  className="w-full gap-2 text-xs font-semibold py-2 rounded-xl transition-all"
                  asChild
                >
                  <Link
                    to={reco.actionPath}
                    onClick={() => onClick(reco.key)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {getLabel(reco.actionText)}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
