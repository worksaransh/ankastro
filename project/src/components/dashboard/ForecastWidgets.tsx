import { Card, CardContent } from '@/components/ui/card';
import { Sun, Zap, TrendingUp } from 'lucide-react';
import type { DailyForecast } from '@/lib/dailyForecast';

interface ForecastWidgetsProps {
  forecast: DailyForecast;
  numProfile: any;
  language: string;
}

const ForecastWidgets = ({ forecast, numProfile, language }: ForecastWidgetsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
      {/* Today's Lucky */}
      <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium text-gold">
              {language === 'hi' ? 'आज का भाग्य' : language === 'en' ? "Today's Luck" : 'Aaj ka Bhagya'}
            </span>
            <span className="ml-auto text-xs text-muted-foreground">{'★'.repeat(forecast.rating)}</span>
          </div>
          <p className="text-2xl font-bold text-foreground mb-0.5">{language === 'hi' ? '🍀 अंक ' : '🍀 #'}{forecast.luckyNumber}</p>
          <p className="text-xs text-muted-foreground">{forecast.luckyColor?.[language === 'hi' ? 'hi' : 'en'] || forecast.luckyColor?.en}</p>
          <p className="text-xs text-primary mt-1">{forecast.focus?.[language as keyof typeof forecast.focus] || forecast.focus?.hinglish}</p>
        </CardContent>
      </Card>

      {/* Today's Tip */}
      <Card className="border-primary/20">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">
              {language === 'hi' ? 'आज की सलाह' : language === 'en' ? "Today's Tip" : 'Aaj ki Salah'}
            </span>
          </div>
          <p className="text-sm text-foreground leading-snug">{forecast.tip?.[language as keyof typeof forecast.tip] || forecast.tip?.hinglish}</p>
        </CardContent>
      </Card>

      {/* Personal Year */}
      {numProfile && (
        <Card className="border-cosmic/30 bg-gradient-to-br from-cosmic/5 to-transparent">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cosmic" />
              <span className="text-xs font-medium text-cosmic">
                {language === 'hi' ? 'व्यक्तिगत वर्ष' : 'Personal Year'}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-0.5">Year {numProfile.personalYear}</p>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div className="bg-cosmic h-1.5 rounded-full" style={{ width: `${(new Date().getMonth() + 1) / 12 * 100}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'hi' ? 'वर्ष की प्रगति' : language === 'en' ? 'Year in progress' : 'Saal ki tarakki'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ForecastWidgets;
