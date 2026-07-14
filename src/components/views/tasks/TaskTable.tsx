'use client';

import { Eye, FileText } from 'lucide-react';
import { cn, fmtMoney, fmtDuration, fmtShortDate } from '@/lib/utils';
import type { TaskLog } from '@/lib/types';

interface Props {
  tasks: TaskLog[];
  hasAnyTask: boolean;
  onView: (t: TaskLog) => void;
}

export default function TaskTable({ tasks, hasAnyTask, onView }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="card p-12 text-center">
        <FileText className="w-10 h-10 mx-auto mb-3 text-[var(--ink-300)]" />
        <div className="text-h4 mb-2">{hasAnyTask ? '沒有符合的任務' : '還沒有任何任務'}</div>
        <p className="text-body-sm">建立第一個任務，看 Agent 怎麼協作輸出</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border-soft)] text-left bg-[var(--ink-25)]">
            <th className="text-micro px-5 py-3 font-medium">任務</th>
            <th className="text-micro px-5 py-3 font-medium hidden md:table-cell">由 Agent 執行</th>
            <th className="text-micro px-5 py-3 font-medium hidden lg:table-cell">執行時間</th>
            <th className="text-micro px-5 py-3 font-medium">狀態</th>
            <th className="text-micro px-5 py-3 font-medium text-right">成本</th>
            <th className="px-2"></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t, i) => (
            <tr
              key={t.id}
              className={cn(
                "border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--ink-25)] transition-colors cursor-pointer",
                i % 2 === 1 && "bg-[var(--ink-25)]/30"
              )}
              onClick={() => onView(t)}
            >
              <td className="px-5 py-3.5">
                <div className="text-body font-medium text-[var(--ink-900)]">{t.taskName}</div>
                <div className="text-body-sm text-[var(--ink-500)] mt-0.5">{fmtShortDate(t.createdAt)}</div>
              </td>
              <td className="px-5 py-3.5 hidden md:table-cell">
                <div className="text-body-sm text-[var(--ink-700)]">
                  {t.agentNames.slice(0, 2).join(' · ')}
                  {t.agentNames.length > 2 && ` +${t.agentNames.length - 2}`}
                </div>
              </td>
              <td className="px-5 py-3.5 hidden lg:table-cell text-body-sm text-tabular text-[var(--ink-600)]">
                {fmtDuration(t.totalDurationMs)}
              </td>
              <td className="px-5 py-3.5">
                <span className={cn(
                  "badge",
                  t.status === 'success' ? 'badge-success' :
                  t.status === 'partial' ? 'badge-warning' : 'badge-danger'
                )}>
                  {t.status === 'success' ? '成功' : t.status === 'partial' ? '部分' : '失敗'}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right text-body-sm text-tabular text-[var(--ink-700)]">
                {fmtMoney(t.totalCost)}
              </td>
              <td className="px-3">
                <Eye className="w-4 h-4 text-[var(--ink-400)]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
