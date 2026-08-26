import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const langs: { code: "en" | "hi" | "hinglish"; label: string; aria: string }[] = [
    { code: "en", label: "EN", aria: "English" },
    { code: "hi", label: "हिं", aria: "हिन्दी" },
    { code: "hinglish", label: "Hi+En", aria: "Hinglish" },
  ];

  return (
    <div className="flex items-center gap-1 bg-muted/60 border border-white/10 rounded-xl p-1" role="group" aria-label="Language selector" translate="no">
      {langs.map((l) => (
        <Button
          key={l.code}
          variant={language === l.code ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setLanguage(l.code)}
          className={`gap-1 text-xs px-2.5 h-7 font-medium rounded-lg transition-all ${
            language === l.code ? "bg-primary text-primary-foreground font-bold shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label={l.aria}
          aria-pressed={language === l.code}
        >
          {l.label}
        </Button>
      ))}
    </div>
  );
};

export default LanguageToggle;
