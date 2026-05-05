import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { RatePosition } from '@/lib/useExchangeRates';

type Props = {
  position: RatePosition | null;
  base: string;
  target: string;
};

type Verdict = {
  label: string;
  message: string;
  tone: 'good' | 'neutral' | 'poor';
  Icon: typeof TrendingUp;
};

function getVerdict(percentile: number): Verdict {
  if (percentile >= 80) {
    return {
      label: 'Favorable',
      message: 'Rate is near a 90-day high. Historically, you would receive more than on most recent days.',
      tone: 'good',
      Icon: TrendingUp,
    };
  }
  if (percentile >= 60) {
    return {
      label: 'Above average',
      message: 'Rate is above its recent typical range.',
      tone: 'good',
      Icon: TrendingUp,
    };
  }
  if (percentile >= 40) {
    return {
      label: 'Average',
      message: 'Rate is sitting around its 90-day midpoint.',
      tone: 'neutral',
      Icon: Activity,
    };
  }
  if (percentile >= 20) {
    return {
      label: 'Below average',
      message: 'Rate is below its recent typical range.',
      tone: 'poor',
      Icon: TrendingDown,
    };
  }
  return {
    label: 'Unfavorable',
    message: 'Rate is near a 90-day low. You would receive less than on most recent days.',
    tone: 'poor',
    Icon: TrendingDown,
  };
}

export function RateInsight({ position, base, target }: Props) {
  if (!position) return null;
  const v = getVerdict(position.percentile);

  const toneClasses = {
    good: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    neutral: 'text-muted-foreground bg-muted/30 border-border',
    poor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <Card className="p-5">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Conversion timing
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${toneClasses[v.tone]}`}>
          <v.Icon className="w-3.5 h-3.5" />
          {v.label}
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {position.percentile.toFixed(0)}th percentile · 90d
        </span>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed mb-4">
        {v.message}
      </p>

      {/* Visual range bar */}
      <div className="space-y-1.5">
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary rounded-full"
            style={{ left: `${position.percentile}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>Low {position.min.toFixed(4)}</span>
          <span>High {position.max.toFixed(4)}</span>
        </div>
      </div>
    </Card>
  );
}