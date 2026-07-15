'use client';

import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TaskLog } from '@/lib/types';

interface Props {
  recentTasks: TaskLog[];
}

export default function RecentTasksPanel({ recentTasks }: Props) {
  if (recentTasks.length === 0) return null;

  return (
    <div className="card p-5">
      <div className="text-micro mb-3">最近任務</div>
      <div className="space-y-2">
        {recentTasks.slice(0, 3).map(t => (
          <div key={t.id} className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[var(--navy-400)] flex-shrink-0" />
            <div className="text-body-sm truncate flex-1">{t.taskName}</div>
            <span className={cn(
              "badge",
              t.status === 'success' ? 'badge-success' :
              t.status === 'failed' ? 'badge-danger' : 'badge-warning'
            )}>
              {t.status === 'success' ? '成功' : t.status === 'failed' ? '失敗' : '部分'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
