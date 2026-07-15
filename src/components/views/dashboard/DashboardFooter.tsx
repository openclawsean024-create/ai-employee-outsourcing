'use client';

import { Bot, BarChart3, Plus, Settings } from 'lucide-react';
import type { View } from '@/lib/types';

interface Props {
  onNavigate: (view: View) => void;
}

const FOOTER_LINKS: Array<{ label: string; view: View; icon: React.ElementType }> = [
  { label: 'Agent 庫', view: 'agents', icon: Bot },
  { label: '建立任務', view: 'task_new', icon: Plus },
  { label: '用量', view: 'usage', icon: BarChart3 },
  { label: '設定', view: 'settings', icon: Settings },
];

export default function DashboardFooter({ onNavigate }: Props) {
  return (
    <footer className="border-t border-[var(--border-soft)] pt-8 pb-4">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-7">
        <div className="max-w-xl">
          <div className="text-micro mb-2">AI Employee Beta</div>
          <p className="text-body-sm text-[var(--navy-600)]">
            目前為純前端 Beta，任務、範本與設定保存在你的瀏覽器本機。清除瀏覽資料前，請先到設定匯出備份。
          </p>
        </div>

        <nav aria-label="Dashboard footer navigation" className="flex flex-wrap gap-x-1 gap-y-2">
          {FOOTER_LINKS.map(({ label, view, icon: Icon }) => (
            <button
              key={view}
              type="button"
              onClick={() => onNavigate(view)}
              className="nav-item gap-2"
              aria-label={label}
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-7 pt-4 border-t border-[var(--border-soft)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] text-[var(--navy-500)]">
        <span>AI Employee — 144 種 AI Agent 隨選即用</span>
        <span>Batch 1.5 · local-first prototype</span>
      </div>
    </footer>
  );
}
