import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, HelpCircle, Lightbulb, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CRSContent {
  en: string;
  hi: string;
  hinglish?: string;
}

interface ChallengeReasonSolutionProps {
  title?: CRSContent | string;
  challenge: CRSContent | string;
  reason: CRSContent | string;
  solution: CRSContent | string | string[];
  variant?: 'default' | 'compact' | 'expanded';
  showDisclaimer?: boolean;
}

export const ChallengeReasonSolution: React.FC<ChallengeReasonSolutionProps> = ({
  title,
  challenge,
  reason,
  solution,
  variant = 'default',
  showDisclaimer = true
}) => {
  const { getText, language } = useLanguage();

  const getContent = (content: CRSContent | string): string => {
    if (typeof content === 'string') return content;
    return getText(content);
  };

  const getSolutions = (sol: CRSContent | string | string[]): string[] => {
    if (Array.isArray(sol)) return sol;
    const content = getContent(sol);
    return content.split('. ').filter(s => s.trim());
  };

  const labels = {
    en: { challenge: 'Challenge', reason: 'Reason', solution: 'Solution', disclaimer: 'Spiritual guidance only. Not medical advice.' },
    hi: { challenge: 'चुनौती', reason: 'कारण', solution: 'समाधान', disclaimer: 'केवल आध्यात्मिक मार्गदर्शन। चिकित्सा सलाह नहीं।' },
    hinglish: { challenge: 'Challenge', reason: 'Reason', solution: 'Solution', disclaimer: 'Spiritual guidance only. Not medical advice.' }
  };

  const t = labels[language] || labels.en;
  const solutions = getSolutions(solution);

  if (variant === 'compact') {
    return (
      <div className="space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium text-amber-600 dark:text-amber-400">{t.challenge}: </span>
            <span className="text-muted-foreground">{getContent(challenge)}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium text-blue-600 dark:text-blue-400">{t.reason}: </span>
            <span className="text-muted-foreground">{getContent(reason)}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Lightbulb className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium text-green-600 dark:text-green-400">{t.solution}: </span>
            <span className="text-muted-foreground">{solutions.join('. ')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-background to-muted/30 overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-border/50 bg-primary/5">
          <h4 className="font-semibold text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {getContent(title)}
          </h4>
        </div>
      )}
      <CardContent className={`${title ? 'pt-4' : 'pt-5'} space-y-4`}>
        {/* Challenge */}
        <div className="relative pl-8">
          <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              {t.challenge}
            </p>
            <p className="text-sm text-foreground">{getContent(challenge)}</p>
          </div>
        </div>

        {/* Reason */}
        <div className="relative pl-8">
          <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <HelpCircle className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              {t.reason}
            </p>
            <p className="text-sm text-muted-foreground italic">{getContent(reason)}</p>
          </div>
        </div>

        {/* Solution */}
        <div className="relative pl-8">
          <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-1">
              {t.solution}
            </p>
            {solutions.length > 1 ? (
              <ul className="text-sm text-foreground space-y-1">
                {solutions.map((sol, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{sol}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-foreground">{solutions[0]}</p>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        {showDisclaimer && (
          <p className="text-xs text-muted-foreground italic border-t border-border/50 pt-3 mt-4">
            ⚕️ {t.disclaimer}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// Quick generator for number-based challenges
interface NumberChallenge {
  number: number;
  context: 'lifePath' | 'mulank' | 'destiny' | 'personality';
}

export function getNumberChallenge(num: number, context: string = 'lifePath'): {
  challenge: { en: string; hi: string; hinglish: string };
  reason: { en: string; hi: string; hinglish: string };
  solution: { en: string; hi: string; hinglish: string };
} {
  const challenges: Record<number, typeof getNumberChallenge extends (n: number, c: string) => infer R ? R : never> = {
    1: {
      challenge: {
        en: 'Ego clashes and difficulty accepting help from others',
        hi: 'अहंकार का टकराव और दूसरों से मदद स्वीकार करने में कठिनाई',
        hinglish: 'Ego clashes aur dusron se help accept karne mein difficulty'
      },
      reason: {
        en: 'Number 1 energy creates strong independence - asking for help feels like weakness',
        hi: 'नंबर 1 ऊर्जा मजबूत स्वतंत्रता बनाती है - मदद मांगना कमजोरी जैसा लगता है',
        hinglish: 'Number 1 energy strong independence create karti hai - help maangna weakness jaisa lagta hai'
      },
      solution: {
        en: 'Collaboration expands your power. See teamwork as strategy, not surrender. Practice one "thank you for helping" daily.',
        hi: 'सहयोग आपकी शक्ति का विस्तार करता है। टीमवर्क को रणनीति के रूप में देखें। प्रतिदिन एक "मदद के लिए धन्यवाद" का अभ्यास करें।',
        hinglish: 'Collaboration aapki power expand karta hai. Teamwork ko strategy ke roop mein dekho. Daily ek "thank you for helping" practice karo.'
      }
    },
    2: {
      challenge: {
        en: 'Indecision and over-sensitivity to criticism',
        hi: 'अनिर्णय और आलोचना के प्रति अति-संवेदनशीलता',
        hinglish: 'Indecision aur criticism ke prati over-sensitivity'
      },
      reason: {
        en: 'Number 2 sees all perspectives - making choices feels like betraying other options',
        hi: 'नंबर 2 सभी दृष्टिकोण देखता है - चुनाव करना अन्य विकल्पों को धोखा देना जैसा लगता है',
        hinglish: 'Number 2 sab perspectives dekhta hai - choice karna dusre options ko betray karna jaisa lagta hai'
      },
      solution: {
        en: 'Trust your gut first, analyze second. Set a decision timer. Your sensitivity is strength, not weakness.',
        hi: 'पहले अपने अंतर्ज्ञान पर भरोसा करें, फिर विश्लेषण करें। आपकी संवेदनशीलता ताकत है, कमजोरी नहीं।',
        hinglish: 'Pehle apne gut pe trust karo, phir analyze karo. Decision timer set karo. Aapki sensitivity strength hai.'
      }
    },
    3: {
      challenge: {
        en: 'Scattered energy and unfinished creative projects',
        hi: 'बिखरी हुई ऊर्जा और अधूरे रचनात्मक प्रोजेक्ट',
        hinglish: 'Scattered energy aur unfinished creative projects'
      },
      reason: {
        en: 'Number 3 is attracted to everything creative - new ideas feel more exciting than completing old ones',
        hi: 'नंबर 3 हर रचनात्मक चीज की ओर आकर्षित होता है - नए विचार पुराने पूरे करने से ज्यादा रोमांचक लगते हैं',
        hinglish: 'Number 3 har creative cheez ki taraf attracted hota hai - new ideas old complete karne se zyada exciting lagte hain'
      },
      solution: {
        en: 'One completed project beats ten half-finished ideas. Create a "parking lot" for new ideas. Focus on finishing first.',
        hi: 'एक पूरा प्रोजेक्ट दस अधूरे विचारों से बेहतर है। नए विचारों के लिए "पार्किंग लॉट" बनाएं। पहले पूरा करने पर ध्यान दें।',
        hinglish: 'Ek completed project 10 half-finished ideas se better hai. New ideas ke liye "parking lot" create karo. Finishing pe focus karo.'
      }
    },
    4: {
      challenge: {
        en: 'Resistance to change and workaholic tendencies',
        hi: 'परिवर्तन के प्रति प्रतिरोध और वर्कहोलिक प्रवृत्तियां',
        hinglish: 'Change ke prati resistance aur workaholic tendencies'
      },
      reason: {
        en: 'Number 4 builds security through structure - change threatens the foundation you\'ve worked hard to create',
        hi: 'नंबर 4 संरचना के माध्यम से सुरक्षा बनाता है - परिवर्तन आपकी मेहनत से बनाई नींव को खतरा है',
        hinglish: 'Number 4 structure ke through security build karta hai - change aapki mehnat se banayi foundation ko threaten karta hai'
      },
      solution: {
        en: 'Build systems that can evolve. Stability comes from adaptability. Schedule rest like meetings. Small changes daily.',
        hi: 'ऐसी प्रणालियां बनाएं जो विकसित हो सकें। स्थिरता अनुकूलनशीलता से आती है। बैठकों की तरह आराम निर्धारित करें।',
        hinglish: 'Aise systems banao jo evolve ho sakein. Stability adaptability se aati hai. Rest meetings ki tarah schedule karo.'
      }
    },
    5: {
      challenge: {
        en: 'Commitment issues and constant restlessness',
        hi: 'प्रतिबद्धता की समस्याएं और निरंतर बेचैनी',
        hinglish: 'Commitment issues aur constant restlessness'
      },
      reason: {
        en: 'Number 5 craves freedom and variety - commitment feels like a cage cutting off possibilities',
        hi: 'नंबर 5 स्वतंत्रता और विविधता चाहता है - प्रतिबद्धता संभावनाओं को काटने वाला पिंजरा लगती है',
        hinglish: 'Number 5 freedom aur variety crave karta hai - commitment possibilities cut karne wala cage lagti hai'
      },
      solution: {
        en: 'True freedom comes from commitment. Find variety WITHIN your commitments. Change environments, not responsibilities.',
        hi: 'सच्ची स्वतंत्रता प्रतिबद्धता से आती है। अपनी प्रतिबद्धताओं के भीतर विविधता खोजें। वातावरण बदलें, जिम्मेदारियां नहीं।',
        hinglish: 'True freedom commitment se aati hai. Apni commitments ke WITHIN variety khojo. Environment change karo, responsibilities nahi.'
      }
    },
    6: {
      challenge: {
        en: 'Over-responsibility and neglecting self-care',
        hi: 'अति-जिम्मेदारी और आत्म-देखभाल की उपेक्षा',
        hinglish: 'Over-responsibility aur self-care neglect karna'
      },
      reason: {
        en: 'Number 6 is the caretaker - your worth feels tied to how much you give to others',
        hi: 'नंबर 6 देखभालकर्ता है - आपका मूल्य इस बात से जुड़ा लगता है कि आप दूसरों को कितना देते हैं',
        hinglish: 'Number 6 caretaker hai - aapka worth dusron ko kitna dete ho usse tied lagta hai'
      },
      solution: {
        en: 'Put your oxygen mask on first. Your growth serves everyone. Practice receiving without guilt. "No" is a complete sentence.',
        hi: 'पहले अपना ऑक्सीजन मास्क लगाएं। आपका विकास सबकी सेवा करता है। बिना अपराधबोध के प्राप्त करने का अभ्यास करें।',
        hinglish: 'Pehle apna oxygen mask lagao. Aapka growth sabki serve karta hai. Bina guilt ke receive karna practice karo.'
      }
    },
    7: {
      challenge: {
        en: 'Overthinking and difficulty trusting others',
        hi: 'अति-विचार और दूसरों पर भरोसा करने में कठिनाई',
        hinglish: 'Overthinking aur dusron pe trust karne mein difficulty'
      },
      reason: {
        en: 'Number 7 seeks deep understanding - surface connections feel meaningless and potentially deceptive',
        hi: 'नंबर 7 गहरी समझ चाहता है - सतही संबंध अर्थहीन और संभावित धोखेबाज लगते हैं',
        hinglish: 'Number 7 deep understanding seek karta hai - surface connections meaningless aur potentially deceptive lagti hain'
      },
      solution: {
        en: 'Not everyone needs to be understood deeply. Create thinking time limits. Share insights with one trusted person.',
        hi: 'हर किसी को गहराई से समझने की जरूरत नहीं। सोचने की समय सीमा बनाएं। एक विश्वसनीय व्यक्ति के साथ अंतर्दृष्टि साझा करें।',
        hinglish: 'Har kisi ko deeply understand karne ki zarurat nahi. Thinking time limits create karo. Ek trusted person ke saath insights share karo.'
      }
    },
    8: {
      challenge: {
        en: 'Power struggles and material obsession',
        hi: 'सत्ता संघर्ष और भौतिक जुनून',
        hinglish: 'Power struggles aur material obsession'
      },
      reason: {
        en: 'Number 8 understands power dynamics deeply - success becomes identity, making failure feel existential',
        hi: 'नंबर 8 शक्ति गतिशीलता को गहराई से समझता है - सफलता पहचान बन जाती है, असफलता अस्तित्वगत लगती है',
        hinglish: 'Number 8 power dynamics deeply samajhta hai - success identity ban jaati hai, failure existential lagti hai'
      },
      solution: {
        en: 'True power includes everyone. Build success on integrity. Define worth beyond achievements. Balance ambition with relationships.',
        hi: 'सच्ची शक्ति सबको शामिल करती है। ईमानदारी पर सफलता बनाएं। उपलब्धियों से परे मूल्य परिभाषित करें।',
        hinglish: 'True power sabko include karti hai. Integrity pe success build karo. Achievements se pare worth define karo.'
      }
    },
    9: {
      challenge: {
        en: 'Idealism burnout and difficulty with practical details',
        hi: 'आदर्शवाद थकान और व्यावहारिक विवरण में कठिनाई',
        hinglish: 'Idealism burnout aur practical details mein difficulty'
      },
      reason: {
        en: 'Number 9 sees the big picture so clearly - small steps feel painfully slow compared to the vision',
        hi: 'नंबर 9 बड़ी तस्वीर बहुत स्पष्ट देखता है - छोटे कदम दृष्टि की तुलना में दर्दनाक रूप से धीमे लगते हैं',
        hinglish: 'Number 9 big picture bahut clearly dekhta hai - small steps vision ke comparison mein painfully slow lagte hain'
      },
      solution: {
        en: 'Change happens in small steps. Love the daily work that builds the dream. Set boundaries on giving. Rest is not retreat.',
        hi: 'परिवर्तन छोटे कदमों में होता है। सपने को बनाने वाले दैनिक कार्य से प्यार करें। देने पर सीमाएं निर्धारित करें।',
        hinglish: 'Change small steps mein hota hai. Dream banane wale daily work se pyaar karo. Giving pe boundaries set karo.'
      }
    },
    11: {
      challenge: {
        en: 'Nervous energy and unrealistic expectations of self',
        hi: 'घबराहट की ऊर्जा और खुद से अवास्तविक अपेक्षाएं',
        hinglish: 'Nervous energy aur khud se unrealistic expectations'
      },
      reason: {
        en: 'Master 11 carries dual vibration (11 and 2) - you sense higher purpose but feel inadequate to fulfill it',
        hi: 'मास्टर 11 दोहरी कंपन वहन करता है - आप उच्च उद्देश्य महसूस करते हैं लेकिन इसे पूरा करने में अपर्याप्त महसूस करते हैं',
        hinglish: 'Master 11 dual vibration carry karta hai - aap higher purpose sense karte ho par inadequate feel karte ho'
      },
      solution: {
        en: 'Ground your intuition in practical action. You don\'t need to be perfect to inspire. Small acts of service fulfill your mission.',
        hi: 'अपने अंतर्ज्ञान को व्यावहारिक कार्रवाई में स्थापित करें। प्रेरित करने के लिए परफेक्ट होना जरूरी नहीं।',
        hinglish: 'Apne intuition ko practical action mein ground karo. Inspire karne ke liye perfect hona zaruri nahi.'
      }
    },
    22: {
      challenge: {
        en: 'Overwhelm from grand visions and pressure to achieve big',
        hi: 'भव्य दृष्टिकोण से अभिभूत और बड़ा हासिल करने का दबाव',
        hinglish: 'Grand visions se overwhelm aur big achieve karne ka pressure'
      },
      reason: {
        en: 'Master 22 is the Master Builder - you see what\'s possible but the gap between vision and reality feels crushing',
        hi: 'मास्टर 22 मास्टर बिल्डर है - आप देखते हैं क्या संभव है लेकिन दृष्टि और वास्तविकता के बीच का अंतर कुचलने वाला लगता है',
        hinglish: 'Master 22 Master Builder hai - aap dekhte ho kya possible hai par vision aur reality ka gap crushing lagta hai'
      },
      solution: {
        en: 'Build one brick at a time. Delegate and collaborate. Your vision needs others to manifest. Progress over perfection.',
        hi: 'एक समय में एक ईंट रखें। प्रतिनिधि करें और सहयोग करें। आपकी दृष्टि को प्रकट करने के लिए दूसरों की जरूरत है।',
        hinglish: 'Ek time pe ek brick lagao. Delegate aur collaborate karo. Aapki vision ko manifest karne ke liye dusron ki zarurat hai.'
      }
    },
    33: {
      challenge: {
        en: 'Martyrdom tendencies and unrealistic compassion expectations',
        hi: 'शहादत की प्रवृत्तियां और अवास्तविक करुणा अपेक्षाएं',
        hinglish: 'Martyrdom tendencies aur unrealistic compassion expectations'
      },
      reason: {
        en: 'Master 33 is the Master Teacher - you feel responsible for others\' spiritual growth and suffering',
        hi: 'मास्टर 33 मास्टर टीचर है - आप दूसरों के आध्यात्मिक विकास और पीड़ा के लिए जिम्मेदार महसूस करते हैं',
        hinglish: 'Master 33 Master Teacher hai - aap dusron ke spiritual growth aur suffering ke liye responsible feel karte ho'
      },
      solution: {
        en: 'Teach by example, not sacrifice. Healthy boundaries enable sustainable service. Heal yourself to heal others effectively.',
        hi: 'उदाहरण से सिखाएं, बलिदान से नहीं। स्वस्थ सीमाएं स्थायी सेवा को सक्षम बनाती हैं। दूसरों को प्रभावी रूप से ठीक करने के लिए खुद को ठीक करें।',
        hinglish: 'Example se sikhao, sacrifice se nahi. Healthy boundaries sustainable service enable karti hain. Dusron ko heal karne ke liye pehle khud heal ho.'
      }
    }
  };

  return challenges[num] || challenges[1];
}

export default ChallengeReasonSolution;
