import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, Sun, Gem, FileText, ArrowUpRight } from 'lucide-react';

interface QuickActionsProps {
  language: string;
  hasPlusAccess?: boolean;
}

const QuickActions = ({ language, hasPlusAccess = false }: QuickActionsProps) => {
  const actions = [
    {
      to: '/form',
      icon: <FileText className="w-5 h-5" />,
      label: language === 'hi' ? 'नई रिपोर्ट बनाएं' : 'Generate New Report',
      desc: language === 'hi' ? 'विस्तृत अंकशास्त्र रिपोर्ट' : 'Detailed numerology report',
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20',
    },
    {
      to: '/ai-chat',
      icon: <MessageCircle className="w-5 h-5" />,
      label: language === 'hi' ? 'AI से पूछें' : 'Ask AI Consultant',
      desc: language === 'hi' ? 'व्यक्तिगत AI सहायक' : 'Personalized AI assistant',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      to: '/daily-forecast',
      icon: <Sun className="w-5 h-5" />,
      label: language === 'hi' ? 'दैनिक भविष्यफल' : 'Daily Forecast',
      desc: language === 'hi' ? 'आज का भाग्य जांचें' : 'Check today\'s luck',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      to: '/remedies',
      icon: <Gem className="w-5 h-5" />,
      label: language === 'hi' ? 'उपाय और रत्न' : 'Remedies & Gemstones',
      desc: language === 'hi' ? 'शुभ रत्न और उपचार' : 'Auspicious gems & fixes',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className={`
            flex flex-col items-start gap-2 p-4 rounded-xl border transition-all duration-300
            hover:scale-[1.02] hover:shadow-lg group
            ${action.bg}
          `}
        >
          <div className={`${action.color} group-hover:scale-110 transition-transform`}>
            {action.icon}
          </div>
          <div>
            <p className={`text-sm font-semibold text-foreground flex items-center gap-1`}>
              {action.label}
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{action.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
