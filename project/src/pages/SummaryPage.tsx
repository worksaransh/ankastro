import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserFormData } from '@/types/formTypes';
import { ChevronLeft, Sparkles, Edit2, Info } from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

const SummaryPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState<UserFormData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('numerologyFormData');
    if (stored) {
      setFormData(JSON.parse(stored));
    } else {
      navigate('/form');
    }
  }, [navigate]);

  if (!formData) return null;

  const generateReport = () => {
    navigate('/report');
  };

  const sections = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Full Birth Name', value: formData.fullBirthName },
        { label: 'Current Name', value: formData.currentName },
        { label: 'Date of Birth', value: formData.dateOfBirth },
        { label: 'Gender', value: formData.gender.replace('_', ' ') },
        { label: 'Location', value: `${formData.city}, ${formData.country}`.replace(', ', '') || 'Not provided' },
        { label: 'Email', value: formData.email },
        { label: 'WhatsApp', value: formData.whatsappNumber || 'Not provided' },
      ],
    },
    {
      title: 'Life Context',
      items: [
        { label: 'Relationship Status', value: formData.relationshipStatus || 'Not provided' },
        { label: 'Profession', value: formData.profession || 'Not provided' },
      ],
    },
    {
      title: 'Goals & Guidance',
      items: [
        { label: 'Biggest Challenge', value: formData.biggestChallenge || 'Not provided' },
        { label: 'Main Goal', value: formData.mainGoal || 'Not provided' },
        { label: 'Fear or Stuck', value: formData.fearOrStuck || 'Not provided' },
        { label: 'Confused Between', value: formData.confusedBetween || 'Not provided' },
        { label: 'Destiny Calling', value: formData.destinyCallingYou || 'Not provided' },
        { label: 'Repeating Pattern', value: formData.repeatingPattern || 'Not provided' },
        { label: 'Miracle Wish', value: formData.miracleWish || 'Not provided' },
      ],
    },
  ];

  if (formData.includeCompatibility) {
    sections.push({
      title: 'Compatibility',
      items: [
        { label: "Partner's Name", value: formData.partnerName || 'Not provided' },
        { label: "Partner's DOB", value: formData.partnerDob || 'Not provided' },
        { label: "Business Partner", value: formData.businessPartnerName || 'Not provided' },
        { label: "Business Partner DOB", value: formData.businessPartnerDob || 'Not provided' },
      ],
    });
  }

  return (
    <>
      <SEO title="Your Numerology Summary — Free Preview" description="Your free numerology summary is ready. Unlock the complete 100+ page advanced report." canonical="/summary" noindex={true} />
          <div className="min-h-screen py-4 sm:py-8 px-4 relative spiritual-pattern">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between py-3 bg-background/80 backdrop-blur -mx-4 px-4 mb-4">
        <Logo size="sm" />
        <LanguageToggle />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* "What is this report?" explainer — helps layman users understand context */}
        <div className="mb-5 sm:mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex gap-3 animate-fade-in">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-foreground text-sm sm:text-base mb-1">
              {t('explainer.title')}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t('explainer.body')}
            </p>
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="font-display text-2xl sm:text-4xl text-primary mb-2">Review Your Details</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Please confirm your information before generating your report</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {sections.map((section, sectionIndex) => (
            <div 
              key={section.title} 
              className="card-divine rounded-xl p-4 sm:p-6 animate-slide-up"
              style={{ animationDelay: `${sectionIndex * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-display text-lg sm:text-xl text-primary">{section.title}</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/form')}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between text-sm gap-0.5 sm:gap-2">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground font-medium capitalize sm:max-w-[60%] sm:text-right break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6 sm:mt-8">
          <Button variant="outline" onClick={() => navigate('/form')} className="w-full sm:w-auto">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Make Changes
          </Button>
          <Button 
            size="lg" 
            onClick={generateReport}
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/30 transition-all hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Reveal My Blueprint ✨
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default SummaryPage;
