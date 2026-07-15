'use client';

import { TrendingUp, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { fmtMoney, fmtNumber, TIER_LIMITS } from '@/lib/utils';
import type { TaskLog, UserSettings } from '@/lib/types';

interface Props {
  tasks: TaskLog[];
  settings: UserSettings;
}

function BigMetric({ icon: Icon, label, value, sub }: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-micro">{label}</div>
        <Icon className="w-4 h-4 text-[var(--brand)]" strokeWidth={1.75} />
      </div>
      <div className="text-h2 text-tabular mb-1">{value}</div>
      {sub && <div className="text-body-sm text-[var(--navy-500)]">{sub}</div>}
    </div>
  );
}

export default function UsageMetrics({ tasks, settings }: Props) {
  const tierLimit = TIER_LIMITS[settings.tier];
  const totalCost = tasks.reduce((s, t) => s + t.totalCost, 0);
  const successCount = tasks.filter(t => t.status === 'success').length;
  const totalDurationMs = tasks.reduce((s, t) => s + t.totalDurationMs, 0);
  const savedHours = (totalDurationMs / 3600000) * 8;
  const avgCost = tasks.length > 0 ? (totalCost / tasks.length).toFixed(2) : '0.00';

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BigMetric
          icon={TrendingUp}
          label="總任務數"
          value={fmtNumber(tasks.length)}
          sub={`本月 ${settings.monthlyTaskUsed} / ${tierLimit.taskLimit}`}
        />
        <BigMetric
          icon={CheckCircle2}
          label="成功率"
          value={tasks.length > 0 ? `${Math.round((successCount / tasks.length) * 100)}%` : '—'}
          sub={`${successCount} / ${tasks.length}`}
        />
        <BigMetric
          icon={Clock}
          label="節省時間"
          value={`${savedHours.toFixed(1)}h`}
          sub="vs 人工估算"
        />
        <BigMetric
          icon={DollarSign}
          label="累計成本"
          value={fmtMoney(totalCost)}
          sub={`平均 NT$${avgCost} / 任務`}
        />
      </div>
    </section>
  );
}
