import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Tier, TIERS, tierRank } from '@/lib/tiers';
import { isIndividualReport } from '@/lib/constants';
import {
  FileText, Calendar, Clock, Eye, Download, Loader2,
  ArrowUpRight, Crown,
} from 'lucide-react';

export interface UserReport {
  id: string;
  created_at: string;
  report_type: string;
  form_data: any;
  tier_unlocked?: Tier;
  relation?: string;
  display_name?: string | null;
}

interface ReportListItemProps {
  report: UserReport;
  reportTier: Tier;
  accountTier: Tier;
  language: string;
  downloadingId: string | null;
  tr: Record<string, string>;
  onOpen: (report: UserReport) => void;
  onDownload: (report: UserReport) => void;
  onUpgrade: (reportId: string, nextTier: Tier) => void;
}

const tierColors: Record<Tier, string> = {
  glimpse: 'border-amber-300 text-amber-700 bg-amber-50',
  starter: 'border-blue-300 text-blue-700 bg-blue-50',
  addon:   'border-blue-300 text-blue-700 bg-blue-50',
  pro:     'border-purple-300 text-purple-700 bg-purple-50',
  master:  'border-divine text-divine-foreground bg-divine/10',
};

const ReportListItem = ({
  report,
  reportTier,
  accountTier,
  language,
  downloadingId,
  tr,
  onOpen,
  onDownload,
  onUpgrade,
}: ReportListItemProps) => {
  const formData = report.form_data;
  const createdDate = new Date(report.created_at);
  const isIndividual = isIndividualReport(report.report_type);

  const effectiveTier: Tier = isIndividual ? 'pro' : (reportTier || (accountTier !== 'glimpse' ? accountTier : 'glimpse'));
  const tierLabel = isIndividual ? 'Paid' : (effectiveTier === 'glimpse' ? 'Free' : effectiveTier.charAt(0).toUpperCase() + effectiveTier.slice(1));
  const canUpgrade = !isIndividual && tierRank(effectiveTier) < tierRank('master');
  const nextTier: Tier = effectiveTier === 'glimpse' ? 'starter' : effectiveTier === 'starter' ? 'pro' : 'master';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
          <FileText className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground text-sm sm:text-base truncate">
            {report.display_name || formData?.fullBirthName || 'Numerology Report'}
            {report.relation && report.relation !== 'self' && (
              <span className="ml-2 text-xs text-muted-foreground">({report.relation})</span>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {createdDate.toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {formData?.dateOfBirth && (
              <span className="text-muted-foreground/70">DOB: {formData.dateOfBirth}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-11 sm:ml-0 flex-shrink-0 flex-wrap">
        <Badge variant={report.report_type === 'advanced' ? 'default' : isIndividual ? 'outline' : 'secondary'} className="text-xs">
          {report.report_type === 'advanced' ? tr.advancedReport : isIndividual ? 'Individual' : tr.basicReport}
        </Badge>
        <Badge variant="outline" className={`text-xs ${tierColors[effectiveTier]}`}>
          <Crown className="w-3 h-3 mr-1" />
          {tierLabel}
        </Badge>
        {canUpgrade && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-xs border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => onUpgrade(report.id, nextTier)}
          >
            <ArrowUpRight className="w-3 h-3" />
            Upgrade
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={() => onOpen(report)}
        >
          <Eye className="w-3 h-3" />
          {tr.viewReport}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={() => onDownload(report)}
          disabled={downloadingId === report.id}
        >
          {downloadingId === report.id ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Download className="w-3 h-3" />
          )}
          {tr.downloadPdf}
        </Button>
      </div>
    </div>
  );
};

export default ReportListItem;
