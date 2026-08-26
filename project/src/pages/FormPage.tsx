import React from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from '@/components/LanguageToggle';
import { Logo } from '@/components/Logo';
import SEO from '@/components/SEO';
import QuestionFirstFlow from '@/components/QuestionFirstFlow';

export const FormPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Cosmic Guidance — Question-First Astrological & Numerological Analysis"
        description="Select your life topic and discover accurate Vedic astrological and numerological insights tailored to your birth details."
        canonical="/form"
        noindex={true}
      />
      <div className="min-h-screen py-4 sm:py-8 px-4 relative spiritual-pattern">
        {/* Header with Logo and Language Toggle */}
        <div className="sticky top-0 z-50 flex items-center justify-between py-3 bg-background/80 backdrop-blur -mx-4 px-4 mb-2">
          <Logo size="sm" />
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
          </div>
        </div>

        {/* Modern Question-First Onboarding Flow */}
        <QuestionFirstFlow onComplete={() => navigate('/report')} />
      </div>
    </>
  );
};

export default FormPage;