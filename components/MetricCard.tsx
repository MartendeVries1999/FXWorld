import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

type Props = {
  label: string;
  value: string;
  change?: number | null;
};

export function MetricCard({ label, value, change }: Props) {
  const isUp = change !== null && change !== undefined && change > 0;
  const isDown = change !== null && change !== undefined && change < 0;

  const Icon = isUp ? ArrowUp : isDown ? ArrowDown : Minus;
  const colorClass = isUp
    ? 'text-emerald-400'
    : isDown
    ? 'text-rose-400'
    : 'text-muted-foreground';

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
          {label}
        </div>
        {change !== undefined && change !== null && (
          <span className={`flex items-center gap-0.5 text-xs font-mono ${colorClass}`}>
            <Icon className="w-3 h-3" />
            {Math.abs(change).toFixed(2)}%
          </span>
        )}
      </div>
      <div className="font-mono text-lg font-medium tracking-tight truncate">
        {value}
      </div>
    </Card>
  );
}