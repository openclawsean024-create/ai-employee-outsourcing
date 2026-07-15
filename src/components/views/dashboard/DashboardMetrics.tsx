'use client';

import { Activity, DollarSign, TrendingDown, CheckCircle2 } from 'lucide-react';

interface MetricProps {
  label: string;
  value: string;
  delta?: string;
  deltaColor?: 'success' | 'neutral' | 'warning';
  icon: React.ElementType;
}

function Metric({ label, value, delta, deltaColor = 'neutral', icon: Icon }: MetricProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--navy-500)]">
          {label}
        </div>
        <div className="w-8 h-8 rounded-[8px] bg-[var(--brand-soft)] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[var(--brand)]" strokeWidth={2} />
        </div>
      </div>
      <div className="text-h2 text-tabular text-[var(--navy-900)] mb-1">{value}</div>
      {delta && (
        <div className={`text-[13px] font-medium ${
          deltaColor === 'success' ? 'text-[var(--success)]' :
          deltaColor === 'warning' ? 'text-[var(--warning)]' :
          'text-[var(--navy-600)]'
        }`}>{delta}</div>
      )}
    </div>
  );
}

export default function DashboardMetrics() {
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric
          label="任務執行 / 月"
          value="1,244"
          delta="↑ 4.9×"
          deltaColor="success"
          icon={Activity}
        />
        <Metric
          label="花費 / 月"
          value="$118"
          delta="↓ 69%"
          deltaColor="success"
          icon={DollarSign}
        />
        <Metric
          label="平均任務成本"
          value="$0.09"
          delta="從 $0.14 下降"
          deltaColor="neutral"
          icon={TrendingDown}
        />
        <Metric
          label="評測通過率"
          value="96%"
          delta="目標 ≥ 90%"
          deltaColor="success"
          icon={CheckCircle2}
        />
      </div>
    </section>
  );
}