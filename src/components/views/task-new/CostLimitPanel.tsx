'use client';

import type { UserSettings } from '@/lib/types';

interface Props {
  settings: UserSettings;
  onChange: (v: number) => void;
}

export default function CostLimitPanel({ settings, onChange }: Props) {
  return (
    <div className="card p-5">
      <div className="text-micro mb-3">成本上限</div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-h2 text-tabular">NT${settings.defaultCostLimit}</span>
        <span className="text-body-sm text-[var(--ink-500)]">/ 任務</span>
      </div>
      <input
        type="range"
        min="1"
        max="50"
        step="1"
        value={settings.defaultCostLimit}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[var(--brand)]"
      />
      <div className="text-body-sm text-[var(--ink-500)] mt-1">
        超過會要求確認
      </div>
    </div>
  );
}
