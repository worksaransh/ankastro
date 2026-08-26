import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface InfoIconProps {
  content: {
    en: string;
    hi: string;
    hinglish?: string;
  } | string;
  title?: {
    en: string;
    hi: string;
    hinglish?: string;
  } | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InfoIcon: React.FC<InfoIconProps> = ({ 
  content, 
  title,
  size = 'sm',
  className = ''
}) => {
  const { language, getText } = useLanguage();

  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const displayContent = typeof content === 'string' ? content : getText(content);
  const displayTitle = title ? (typeof title === 'string' ? title : getText(title)) : null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-full p-0.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
            aria-label="Information"
          >
            <Info className={sizeClasses[size]} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-[280px] p-3 bg-popover border border-border shadow-lg rounded-lg"
        >
          {displayTitle && (
            <p className="font-semibold text-foreground text-sm mb-1">{displayTitle}</p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">{displayContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Preset InfoIcons for common numerology terms
export const LifePathInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Life Path Number', 
      hi: 'जीवन पथ संख्या', 
      hinglish: 'Life Path Number' 
    }}
    content={{
      en: 'Your soul\'s chosen journey. Calculated by adding all digits of your full birth date. Master numbers 11, 22, 33 are preserved.',
      hi: 'आपकी आत्मा की चुनी हुई यात्रा। आपकी पूर्ण जन्म तिथि के सभी अंकों को जोड़कर निकाला जाता है। मास्टर नंबर 11, 22, 33 संरक्षित रहते हैं।',
      hinglish: 'Aapki soul ki chosen journey. Full birth date ke sab digits add karke nikalta hai. Master numbers 11, 22, 33 preserve hote hain.'
    }}
  />
);

export const DestinyInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Destiny/Expression Number', 
      hi: 'भाग्य/अभिव्यक्ति संख्या', 
      hinglish: 'Destiny/Expression Number' 
    }}
    content={{
      en: 'Your purpose blueprint. Calculated from all letters in your full birth name using Pythagorean mapping (A=1 to I=9, repeating).',
      hi: 'आपका उद्देश्य ब्लूप्रिंट। आपके पूर्ण जन्म नाम के सभी अक्षरों से पाइथागोरियन मैपिंग का उपयोग करके निकाला जाता है।',
      hinglish: 'Aapka purpose blueprint. Full birth name ke sab letters se Pythagorean mapping use karke nikalta hai (A=1 to I=9, repeat).'
    }}
  />
);

export const SoulUrgeInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Soul Urge/Heart\'s Desire', 
      hi: 'आत्मा की इच्छा', 
      hinglish: 'Soul Urge/Heart\'s Desire' 
    }}
    content={{
      en: 'Your emotional truth. Calculated from ONLY vowels (A, E, I, O, U) in your name. Reveals your innermost desires and motivations.',
      hi: 'आपकी भावनात्मक सच्चाई। केवल स्वर (A, E, I, O, U) से निकाला जाता है। आपकी अंतरतम इच्छाओं को प्रकट करता है।',
      hinglish: 'Aapki emotional truth. SIRF vowels (A, E, I, O, U) se nikalta hai. Aapki innermost desires reveal karta hai.'
    }}
  />
);

export const PersonalityInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Personality Number', 
      hi: 'व्यक्तित्व संख्या', 
      hinglish: 'Personality Number' 
    }}
    content={{
      en: 'Your social mask. Calculated from ONLY consonants in your name. Shows how others perceive you and your first impression.',
      hi: 'आपका सामाजिक मुखौटा। केवल व्यंजनों से निकाला जाता है। दूसरे आपको कैसे देखते हैं यह दर्शाता है।',
      hinglish: 'Aapka social mask. SIRF consonants se nikalta hai. Dusre aapko kaise dekhte hain yeh batata hai.'
    }}
  />
);

export const MulankInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Mulank (Birth Number)', 
      hi: 'मूलांक (जन्मांक)', 
      hinglish: 'Mulank (Birth Number)' 
    }}
    content={{
      en: 'Your birth energy. Just the day of birth reduced to single digit. Master numbers 11 and 22 are preserved if the day is exactly 11 or 22.',
      hi: 'आपकी जन्म ऊर्जा। सिर्फ जन्म का दिन एकल अंक में। यदि दिन 11 या 22 है तो मास्टर नंबर संरक्षित रहते हैं।',
      hinglish: 'Aapki birth energy. Sirf birth day single digit mein. Agar day exactly 11 ya 22 hai toh master number preserve hota hai.'
    }}
  />
);

export const BhagyankInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Bhagyank (Destiny Number)', 
      hi: 'भाग्यांक', 
      hinglish: 'Bhagyank (Destiny Number)' 
    }}
    content={{
      en: 'Your destiny outcome. Full DOB (DD+MM+YYYY) all digits added and reduced. Same as Life Path. Reveals your karmic purpose.',
      hi: 'आपका भाग्य परिणाम। पूर्ण DOB (DD+MM+YYYY) सभी अंक जोड़कर घटाएं। आपके कार्मिक उद्देश्य को प्रकट करता है।',
      hinglish: 'Aapka destiny outcome. Full DOB (DD+MM+YYYY) ke sab digits add karke reduce karo. Aapka karmic purpose batata hai.'
    }}
  />
);

export const MasterNumberInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Master Number', 
      hi: 'मास्टर नंबर', 
      hinglish: 'Master Number' 
    }}
    content={{
      en: '11, 22, and 33 carry intensified spiritual energy. Written as 11/2, 22/4, 33/6 to show both vibrations. Higher potential but greater challenges.',
      hi: '11, 22, और 33 तीव्र आध्यात्मिक ऊर्जा रखते हैं। दोनों कंपन दिखाने के लिए 11/2, 22/4, 33/6 लिखा जाता है।',
      hinglish: '11, 22, aur 33 intense spiritual energy carry karte hain. Dono vibrations dikhane ke liye 11/2, 22/4, 33/6 likha jata hai.'
    }}
  />
);

export const SunSignInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Sun Sign', 
      hi: 'सूर्य राशि', 
      hinglish: 'Sun Sign' 
    }}
    content={{
      en: 'Your identity core. Based on your birth date. Represents your ego, willpower, and the essence of who you are at your core.',
      hi: 'आपकी पहचान का केंद्र। जन्म तिथि पर आधारित। आपके अहंकार, इच्छाशक्ति और मूल सार का प्रतिनिधित्व करता है।',
      hinglish: 'Aapki identity ka core. Birth date pe based. Aapka ego, willpower, aur core essence represent karta hai.'
    }}
  />
);

export const MoonSignInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Moon Sign', 
      hi: 'चंद्र राशि', 
      hinglish: 'Moon Sign' 
    }}
    content={{
      en: 'Your emotional nature. Based on moon position at birth time. Reveals your inner emotional world, instincts, and how you process feelings.',
      hi: 'आपकी भावनात्मक प्रकृति। जन्म समय पर चंद्रमा की स्थिति पर आधारित। आपकी आंतरिक भावनात्मक दुनिया को प्रकट करता है।',
      hinglish: 'Aapki emotional nature. Birth time pe moon ki position pe based. Aapki inner emotional world reveal karta hai.'
    }}
  />
);

export const RisingSignInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Rising/Ascendant Sign', 
      hi: 'लग्न राशि', 
      hinglish: 'Rising/Lagna Sign' 
    }}
    content={{
      en: 'Your external projection. Changes every ~2 hours based on birth time. How you appear to others and approach new situations.',
      hi: 'आपका बाहरी प्रक्षेपण। जन्म समय के आधार पर हर ~2 घंटे बदलता है। आप दूसरों को कैसे दिखते हैं।',
      hinglish: 'Aapka external projection. Birth time ke basis pe har ~2 hours change hota hai. Aap dusron ko kaise dikhte ho.'
    }}
  />
);

export const LoshuGridInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Loshu Grid', 
      hi: 'लोशु ग्रिड', 
      hinglish: 'Loshu Grid' 
    }}
    content={{
      en: 'Energy distribution map. Uses DDMMYYYY digits placed in 3x3 grid. Missing numbers show lessons, repeated numbers show strengths.',
      hi: 'ऊर्जा वितरण मानचित्र। DDMMYYYY अंक 3x3 ग्रिड में। गायब संख्याएं सबक दिखाती हैं, दोहराई गई संख्याएं ताकत दिखाती हैं।',
      hinglish: 'Energy distribution ka map. DDMMYYYY digits 3x3 grid mein place hote hain. Missing numbers lessons dikhate hain.'
    }}
  />
);

export const KarmicDebtInfo: React.FC<{ className?: string }> = ({ className }) => (
  <InfoIcon 
    className={className}
    title={{ 
      en: 'Karmic Debt Numbers', 
      hi: 'कार्मिक ऋण संख्याएं', 
      hinglish: 'Karmic Debt Numbers' 
    }}
    content={{
      en: '13, 14, 16, 19 indicate past life lessons to resolve. They represent challenges that offer profound growth when faced courageously.',
      hi: '13, 14, 16, 19 पिछले जन्म के सबक को हल करने का संकेत देते हैं। साहस से सामना करने पर गहन विकास प्रदान करते हैं।',
      hinglish: '13, 14, 16, 19 past life lessons resolve karne ka indication dete hain. Courageously face karne pe deep growth milti hai.'
    }}
  />
);

export default InfoIcon;
