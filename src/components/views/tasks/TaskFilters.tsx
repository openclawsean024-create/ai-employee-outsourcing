'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TaskLog } from '@/lib/types';

export type StatusFilter = 'all' | TaskLog['status'];

const OPTIONS: { v: StatusFilter; l: string }[] = [
  { v: 'all', l: '全部' },
  { v: 'success', l: '成功' },
  { v: 'partial', l: '部分' },
  { v: 'failed', l: '失敗' },
];

interface Props {
  q: string;
  setQ: (v: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (v: StatusFilter) => void;
}

export default function TaskFilters({ q, setQ, statusFilter, setStatusFilter }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-400)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋任務名稱或 Agent..."
          className="input pl-9"
        />
      </div>
      <div className="flex gap-1">
        {OPTIONS.map(opt => (
          <button
            key={opt.v}
            onClick={() => setStatusFilter(opt.v)}
            className={cn(
              "h-9 px-3.5 rounded-md text-[13px] font-medium transition-colors",
              statusFilter === opt.v
                ? "bg-[var(--ink-900)] text-white"
                : "text-[var(--ink-700)] hover:bg-[var(--ink-50)]"
            )}
          >
            {opt.l}
          </button>
        ))}
      </div>
    </div>
  );
}
