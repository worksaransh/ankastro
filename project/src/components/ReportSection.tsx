import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ReportSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const ReportSection = ({ icon: Icon, title, subtitle, children }: ReportSectionProps) => {
  return (
    <section className="mb-8 card-mystical rounded-2xl p-6 md:p-8 animate-slide-up">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-gold" />
        </div>
        <div>
          <h2 className="font-display text-2xl text-gold">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
};

export default ReportSection;
