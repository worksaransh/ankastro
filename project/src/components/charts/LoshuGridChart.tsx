import { useLanguage } from "@/contexts/LanguageContext";
import { LoshuGrid, missingNumberMeanings } from "@/lib/advancedNumerology";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface LoshuGridChartProps {
  loshuGrid?: LoshuGrid;
  grid?: LoshuGrid;
}

const LoshuGridChart = ({ loshuGrid: propLoshuGrid, grid }: LoshuGridChartProps) => {
  const { language } = useLanguage();
  const loshuGrid = propLoshuGrid || grid;

  if (!loshuGrid || !loshuGrid.grid) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground text-xs">
          Lo Shu Grid data unavailable.
        </CardContent>
      </Card>
    );
  }
  
  // Loshu Grid positions with their numbers
  const gridLayout = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ];
  
  const getCellColor = (count: number): string => {
    if (count === 0) return 'bg-muted/30 text-muted-foreground';
    if (count >= 3) return 'bg-orange-500/20 text-orange-600 ring-2 ring-orange-500/50';
    if (count >= 2) return 'bg-primary/20 text-primary';
    return 'bg-green-500/20 text-green-600';
  };
  
  const getPlaneColor = (strength: string): string => {
    if (strength === 'strong') return 'text-green-600';
    if (strength === 'moderate') return 'text-yellow-600';
    return 'text-red-500';
  };
  
  const labels = {
    en: {
      title: 'Loshu Grid Analysis',
      subtitle: 'Your Energy Distribution Map',
      present: 'Present Numbers',
      missing: 'Missing Numbers',
      overloaded: 'Overloaded Numbers',
      mental: 'Mental Plane',
      emotional: 'Emotional Plane',
      practical: 'Practical Plane',
      arrows: 'Power Arrows',
      noArrows: 'No complete arrows found',
      missingTitle: 'Missing Number Analysis',
    },
    hi: {
      title: 'लो शु ग्रिड विश्लेषण',
      subtitle: 'आपका ऊर्जा वितरण मानचित्र',
      present: 'मौजूद अंक',
      missing: 'अनुपस्थित अंक',
      overloaded: 'अधिभारित अंक',
      mental: 'मानसिक तल',
      emotional: 'भावनात्मक तल',
      practical: 'व्यावहारिक तल',
      arrows: 'शक्ति तीर',
      noArrows: 'कोई पूर्ण तीर नहीं मिला',
      missingTitle: 'अनुपस्थित अंक विश्लेषण',
    },
    hinglish: {
      title: 'Loshu Grid Analysis',
      subtitle: 'Aapka Energy Distribution Map',
      present: 'Present Numbers',
      missing: 'Missing Numbers',
      overloaded: 'Overloaded Numbers',
      mental: 'Mental Plane',
      emotional: 'Emotional Plane',
      practical: 'Practical Plane',
      arrows: 'Power Arrows',
      noArrows: 'Koi complete arrow nahi mila',
      missingTitle: 'Missing Number Analysis',
    },
  };
  
  const t = labels[language] || labels.en;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">9</span>
            </div>
            {t.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* The Grid */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-2 w-fit">
              {gridLayout.map((row, rowIdx) =>
                row.map((num, colIdx) => {
                  const count = loshuGrid.grid[rowIdx][colIdx];
                  return (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center transition-all ${getCellColor(count)}`}
                    >
                      <span className="text-2xl font-display font-bold">{num}</span>
                      <span className="text-xs opacity-70">
                        {count === 0 ? '—' : `×${count}`}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-muted/30" />
              <span>Missing</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-green-500/20" />
              <span>Present (1x)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-primary/20" />
              <span>Strong (2x)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-orange-500/20 ring-1 ring-orange-500/50" />
              <span>Overloaded (3+)</span>
            </div>
          </div>
          
          {/* Number Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg">
              <p className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {t.present}
              </p>
              <div className="flex flex-wrap gap-1">
                {loshuGrid.present.map(n => (
                  <Badge key={n} variant="secondary" className="bg-green-500/20">{n}</Badge>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-red-500/10 rounded-lg">
              <p className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {t.missing}
              </p>
              <div className="flex flex-wrap gap-1">
                {loshuGrid.missing.length > 0 ? (
                  loshuGrid.missing.map(n => (
                    <Badge key={n} variant="secondary" className="bg-red-500/20">{n}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None - Complete!</span>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-orange-500/10 rounded-lg">
              <p className="text-sm font-medium text-orange-600 mb-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                {t.overloaded}
              </p>
              <div className="flex flex-wrap gap-1">
                {loshuGrid.overloaded.length > 0 ? (
                  loshuGrid.overloaded.map(n => (
                    <Badge key={n} variant="secondary" className="bg-orange-500/20">{n}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Planes Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className={`text-sm font-medium mb-1 ${getPlaneColor(loshuGrid.analysis.mentalPlane.strength)}`}>
                {t.mental}
              </p>
              <p className="text-xs text-muted-foreground">Numbers: 4, 9, 2</p>
              <Badge variant="outline" className="mt-2 capitalize">{loshuGrid.analysis.mentalPlane.strength}</Badge>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className={`text-sm font-medium mb-1 ${getPlaneColor(loshuGrid.analysis.emotionalPlane.strength)}`}>
                {t.emotional}
              </p>
              <p className="text-xs text-muted-foreground">Numbers: 3, 5, 7</p>
              <Badge variant="outline" className="mt-2 capitalize">{loshuGrid.analysis.emotionalPlane.strength}</Badge>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className={`text-sm font-medium mb-1 ${getPlaneColor(loshuGrid.analysis.practicalPlane.strength)}`}>
                {t.practical}
              </p>
              <p className="text-xs text-muted-foreground">Numbers: 8, 1, 6</p>
              <Badge variant="outline" className="mt-2 capitalize">{loshuGrid.analysis.practicalPlane.strength}</Badge>
            </div>
          </div>
          
          {/* Arrows */}
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-sm font-medium text-primary mb-2">{t.arrows}</p>
            {loshuGrid.analysis.arrows.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {loshuGrid.analysis.arrows.map((arrow, i) => (
                  <Badge key={i} className="bg-primary/20 text-primary">{arrow}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t.noArrows}</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Missing Number Meanings */}
      {loshuGrid.missing.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.missingTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loshuGrid.missing.map(num => (
              <div key={num} className="p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                <p className="font-medium text-red-600 mb-1">Missing {num}</p>
                <p className="text-sm text-muted-foreground">
                  {missingNumberMeanings[num]?.[language] || missingNumberMeanings[num]?.en}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LoshuGridChart;
