import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Crown,
  Download,
  Star,
  FileText,
  BarChart3,
  Compass,
  Shield,
  Sparkles,
  Calendar,
  Heart,
  DollarSign,
  Leaf,
  Briefcase,
  Lock,
  CheckCircle,
  Zap,
  Gift,
} from "lucide-react";

interface PaywallBenefitsProps {
  onUpgrade: () => void;
  isLoading?: boolean;
}

const PaywallBenefits = ({ onUpgrade, isLoading }: PaywallBenefitsProps) => {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Unlock Your Complete Destiny",
      subtitle: "Get the full 100+ page advanced numerology report",
      price: "₹499",
      priceSubtext: "One-time payment • Lifetime access",
      cta: "Unlock My Destiny Now",
      limitedOffer: "Limited Time Offer",
      discount: "60% OFF",
      originalPrice: "₹1,299",
      guarantee: "100% Satisfaction Guarantee",
      securePayment: "Secure Payment",
      instantAccess: "Instant Access",
      categories: {
        reports: "Premium Reports",
        insights: "Deep Insights",
        guidance: "Life Guidance",
        tools: "Exclusive Tools",
      },
      features: [
        {
          icon: FileText,
          title: "100+ Page PDF Report",
          description: "Comprehensive life blueprint with all charts and analysis",
        },
        {
          icon: BarChart3,
          title: "Visual Charts & Graphs",
          description: "Life timeline, chakra radar, momentum charts & more",
        },
        {
          icon: Compass,
          title: "Loshu Grid Analysis",
          description: "Ancient magic square with missing number meanings",
        },
        {
          icon: Calendar,
          title: "12-Month Predictions",
          description: "Month-by-month guidance for the year ahead",
        },
        {
          icon: Star,
          title: "10-Year Forecast",
          description: "Long-term life cycles and turning point years",
        },
        {
          icon: Shield,
          title: "Pinnacle & Challenge Cycles",
          description: "Your life's major phases with timing",
        },
        {
          icon: Briefcase,
          title: "Career Destiny Path",
          description: "Ideal careers, business timing, success patterns",
        },
        {
          icon: Heart,
          title: "Love & Relationship Matrix",
          description: "Compatibility analysis and relationship guidance",
        },
        {
          icon: DollarSign,
          title: "Money & Abundance Insights",
          description: "Wealth patterns, lucky periods, financial karma",
        },
        {
          icon: Leaf,
          title: "Health & Wellness Guidance",
          description: "Stress patterns, chakra alignment, remedies",
        },
        {
          icon: Sparkles,
          title: "Karmic Debt Analysis",
          description: "Past life influences and karmic lessons",
        },
        {
          icon: Zap,
          title: "Daily Affirmations",
          description: "Personalized affirmations based on your numbers",
        },
      ],
      bonuses: [
        "Vedic Remedies & Gemstone Recommendations",
        "Decision Clarity Engine (Yes/No/Not Now)",
        "Business Name Numerology Tool",
        "Lifetime PDF Download Access",
      ],
    },
    hi: {
      title: "अपना पूर्ण भाग्य खोलें",
      subtitle: "पूर्ण 100+ पेज की उन्नत अंक ज्योतिष रिपोर्ट प्राप्त करें",
      price: "₹499",
      priceSubtext: "एक बार का भुगतान • आजीवन पहुँच",
      cta: "अभी मेरा भाग्य खोलें",
      limitedOffer: "सीमित समय का ऑफर",
      discount: "60% छूट",
      originalPrice: "₹1,299",
      guarantee: "100% संतुष्टि गारंटी",
      securePayment: "सुरक्षित भुगतान",
      instantAccess: "तत्काल पहुँच",
      categories: {
        reports: "प्रीमियम रिपोर्ट",
        insights: "गहरी अंतर्दृष्टि",
        guidance: "जीवन मार्गदर्शन",
        tools: "विशेष उपकरण",
      },
      features: [
        {
          icon: FileText,
          title: "100+ पेज पीडीएफ रिपोर्ट",
          description: "सभी चार्ट और विश्लेषण के साथ व्यापक जीवन ब्लूप्रिंट",
        },
        {
          icon: BarChart3,
          title: "विज़ुअल चार्ट और ग्राफ",
          description: "जीवन समयरेखा, चक्र रडार, गति चार्ट और अधिक",
        },
        {
          icon: Compass,
          title: "लोशु ग्रिड विश्लेषण",
          description: "लुप्त संख्या अर्थों के साथ प्राचीन जादुई वर्ग",
        },
        {
          icon: Calendar,
          title: "12-महीने की भविष्यवाणी",
          description: "आने वाले वर्ष के लिए मासिक मार्गदर्शन",
        },
        {
          icon: Star,
          title: "10-वर्षीय पूर्वानुमान",
          description: "दीर्घकालिक जीवन चक्र और टर्निंग पॉइंट वर्ष",
        },
        {
          icon: Shield,
          title: "शिखर और चुनौती चक्र",
          description: "समय के साथ आपके जीवन के प्रमुख चरण",
        },
        {
          icon: Briefcase,
          title: "करियर भाग्य पथ",
          description: "आदर्श करियर, व्यापार समय, सफलता पैटर्न",
        },
        {
          icon: Heart,
          title: "प्रेम और संबंध मैट्रिक्स",
          description: "संगतता विश्लेषण और संबंध मार्गदर्शन",
        },
        {
          icon: DollarSign,
          title: "धन और समृद्धि अंतर्दृष्टि",
          description: "धन पैटर्न, भाग्यशाली अवधि, वित्तीय कर्म",
        },
        {
          icon: Leaf,
          title: "स्वास्थ्य और कल्याण मार्गदर्शन",
          description: "तनाव पैटर्न, चक्र संरेखण, उपचार",
        },
        {
          icon: Sparkles,
          title: "कर्म ऋण विश्लेषण",
          description: "पिछले जन्म के प्रभाव और कर्म पाठ",
        },
        {
          icon: Zap,
          title: "दैनिक पुष्टि",
          description: "आपकी संख्याओं के आधार पर व्यक्तिगत पुष्टि",
        },
      ],
      bonuses: [
        "वैदिक उपचार और रत्न सिफारिशें",
        "निर्णय स्पष्टता इंजन (हां/नहीं/अभी नहीं)",
        "व्यापार नाम अंकशास्त्र उपकरण",
        "आजीवन पीडीएफ डाउनलोड पहुँच",
      ],
    },
    hinglish: {
      title: "Apna Complete Destiny Unlock Karein",
      subtitle: "Full 100+ page advanced numerology report paayein",
      price: "₹499",
      priceSubtext: "One-time payment • Lifetime access",
      cta: "Mera Destiny Abhi Unlock Karo",
      limitedOffer: "Limited Time Offer",
      discount: "60% OFF",
      originalPrice: "₹1,299",
      guarantee: "100% Satisfaction Guarantee",
      securePayment: "Secure Payment",
      instantAccess: "Instant Access",
      categories: {
        reports: "Premium Reports",
        insights: "Deep Insights",
        guidance: "Life Guidance",
        tools: "Exclusive Tools",
      },
      features: [
        {
          icon: FileText,
          title: "100+ Page PDF Report",
          description: "Complete life blueprint saare charts aur analysis ke saath",
        },
        {
          icon: BarChart3,
          title: "Visual Charts & Graphs",
          description: "Life timeline, chakra radar, momentum charts aur more",
        },
        {
          icon: Compass,
          title: "Loshu Grid Analysis",
          description: "Ancient magic square with missing number meanings",
        },
        {
          icon: Calendar,
          title: "12-Mahine Ki Predictions",
          description: "Agle saal ke liye month-by-month guidance",
        },
        {
          icon: Star,
          title: "10-Saal Ka Forecast",
          description: "Long-term life cycles aur turning point years",
        },
        {
          icon: Shield,
          title: "Pinnacle & Challenge Cycles",
          description: "Aapke life ke major phases with timing",
        },
        {
          icon: Briefcase,
          title: "Career Destiny Path",
          description: "Ideal careers, business timing, success patterns",
        },
        {
          icon: Heart,
          title: "Love & Relationship Matrix",
          description: "Compatibility analysis aur relationship guidance",
        },
        {
          icon: DollarSign,
          title: "Money & Abundance Insights",
          description: "Wealth patterns, lucky periods, financial karma",
        },
        {
          icon: Leaf,
          title: "Health & Wellness Guidance",
          description: "Stress patterns, chakra alignment, remedies",
        },
        {
          icon: Sparkles,
          title: "Karmic Debt Analysis",
          description: "Past life influences aur karmic lessons",
        },
        {
          icon: Zap,
          title: "Daily Affirmations",
          description: "Aapke numbers ke basis par personalized affirmations",
        },
      ],
      bonuses: [
        "Vedic Remedies & Gemstone Recommendations",
        "Decision Clarity Engine (Yes/No/Not Now)",
        "Business Name Numerology Tool",
        "Lifetime PDF Download Access",
      ],
    },
  };

  const t = translations[language] || translations.en;

  return (
    <Card className="relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-divine/5">
      {/* Premium Badge */}
      <div className="absolute top-0 right-0">
        <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-bold">
          <Crown className="w-4 h-4 mr-1" />
          PREMIUM
        </Badge>
      </div>

      <CardHeader className="text-center pt-8 pb-4">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-divine flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive flex items-center justify-center animate-pulse">
              <Gift className="w-4 h-4 text-destructive-foreground" />
            </div>
          </div>
        </div>
        
        <Badge variant="destructive" className="mb-2 self-center mx-auto">
          {t.limitedOffer} • {t.discount}
        </Badge>
        
        <CardTitle className="font-display text-2xl md:text-3xl text-foreground">
          {t.title}
        </CardTitle>
        <p className="text-muted-foreground mt-2">{t.subtitle}</p>
        
        {/* Price */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-muted-foreground line-through text-lg">{t.originalPrice}</span>
          <span className="text-4xl font-bold text-primary">{t.price}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{t.priceSubtext}</p>
      </CardHeader>

      <CardContent className="space-y-6 pb-8">
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-3">
          {t.features.map((feature, i) => (
            <div 
              key={i} 
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bonuses */}
        <div className="bg-gradient-to-r from-primary/10 to-divine/10 rounded-lg p-4">
          <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Bonus Features Included
          </h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {t.bonuses.map((bonus, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-foreground">{bonus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onUpgrade}
          disabled={isLoading}
          size="xl"
          className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-divine hover:from-primary/90 hover:to-divine/90 shadow-lg"
        >
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              <Crown className="w-5 h-5 mr-2" />
              {t.cta}
            </>
          )}
        </Button>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-green-600" />
            {t.securePayment}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="w-4 h-4 text-amber-500" />
            {t.instantAccess}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-primary" />
            {t.guarantee}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaywallBenefits;
