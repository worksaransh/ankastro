import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Info, HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { glossaryTerms, GlossaryKey } from "@/lib/glossary";

interface GlossaryTooltipProps {
  termKey: GlossaryKey;
  children?: React.ReactNode;
  showIcon?: boolean;
  variant?: "inline" | "icon" | "button";
}

export const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({
  termKey,
  children,
  showIcon = true,
  variant = "icon"
}) => {
  const { language } = useLanguage();
  const term = glossaryTerms[termKey];

  if (!term) return <>{children}</>;

  const lang = language === 'hinglish' ? 'hinglish' : language;

  const renderTrigger = () => {
    if (variant === "inline") {
      return (
        <span className="inline-flex items-center gap-1 cursor-help border-b border-dashed border-primary/50 hover:border-primary transition-colors">
          {children || term.term[lang]}
          {showIcon && <Info className="w-3 h-3 text-primary/70" />}
        </span>
      );
    }

    if (variant === "button") {
      return (
        <Button variant="ghost" size="sm" className="h-auto p-1 text-xs gap-1">
          <HelpCircle className="w-3 h-3" />
          {language === 'hi' ? 'समझाएं' : language === 'hinglish' ? 'Samjhao' : 'Explain'}
        </Button>
      );
    }

    return (
      <span className="inline-flex cursor-help">
        {children}
        <Info className="w-4 h-4 ml-1 text-muted-foreground hover:text-primary transition-colors" />
      </span>
    );
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {renderTrigger()}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4" align="center">
        <div className="space-y-2">
          <h4 className="font-display font-semibold text-primary">
            {term.term[lang]}
          </h4>
          <p className="text-xs text-muted-foreground italic">
            {term.shortDef[lang]}
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {term.definition[lang]}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default GlossaryTooltip;
