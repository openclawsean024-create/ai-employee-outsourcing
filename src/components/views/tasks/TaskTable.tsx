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
        <FileText className="w-10 h-10 mx-auto mb-3 text-[var(--navy-300)]" />
        <div className="text-h4 mb-2">{hasAnyTask ? '沒有符合的任務' : '還沒有任何任務'}</div>
        <p className="text-body-sm">建立第一個任務，看 Agent 怎麼協作輸出</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
      {tasks.map((t) => (
        <article key={t.id} data-testid={`task-mobile-card-${t.id}`} className="card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-body font-medium text-[var(--navy-900)] truncate">{t.taskName}</h3>
              <p className="text-body-sm text-[var(--navy-500)] mt-0.5">{fmtShortDate(t.createdAt)}</p>
            </div>
            <span className={cn(
              "badge shrink-0",
              t.status === 'success' ? 'badge-success' :
              t.status === 'partial' ? 'badge-warning' : 'badge-danger'
            )}>
              {t.status === 'success' ? '成功' : t.status === 'partial' ? '部分' : '失敗'}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-body-sm">
            <div>
              <dt className="text-[var(--navy-500)]">由 Agent 執行</dt>
              <dd className="mt-0.5 text-[var(--navy-700)]">{t.agentNames.slice(0, 2).join(' · ')}{t.agentNames.length > 2 && ` +${t.agentNames.length - 2}`}</dd>
            </div>
            <div>
              <dt className="text-[var(--navy-500)]">成本</dt>
              <dd className="mt-0.5 text-[var(--navy-700)] text-tabular">{fmtMoney(t.totalCost)}</dd>
            </div>
            <div>
              <dt className="text-[var(--navy-500)]">執行時間</dt>
              <dd className="mt-0.5 text-[var(--navy-700)] text-tabular">{fmtDuration(t.totalDurationMs)}</dd>
            </div>
          </dl>
          <button type="button" className="btn btn-secondary btn-sm w-full mt-4" onClick={() => onView(t)} aria-label={`檢視${t.taskName}`}>
            <Eye className="w-4 h-4" aria-hidden="true" />
            檢視任務
          </button>
        </article>
      ))}
      </div>

      <div className="hidden md:block card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border-soft)] text-left bg-[var(--cream-50)]">
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
                "border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--cream-50)] transition-colors cursor-pointer",
                i % 2 === 1 && "bg-[var(--cream-50)]/30"
              )}
              onClick={() => onView(t)}
            >
              <td className="px-5 py-3.5">
                <div className="text-body font-medium text-[var(--navy-900)]">{t.taskName}</div>
                <div className="text-body-sm text-[var(--navy-500)] mt-0.5">{fmtShortDate(t.createdAt)}</div>
              </td>
              <td className="px-5 py-3.5 hidden md:table-cell">
                <div className="text-body-sm text-[var(--navy-700)]">
                  {t.agentNames.slice(0, 2).join(' · ')}
                  {t.agentNames.length > 2 && ` +${t.agentNames.length - 2}`}
                </div>
              </td>
              <td className="px-5 py-3.5 hidden lg:table-cell text-body-sm text-tabular text-[var(--navy-600)]">
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
              <td className="px-5 py-3.5 text-right text-body-sm text-tabular text-[var(--navy-700)]">
                {fmtMoney(t.totalCost)}
              </td>
              <td className="px-3">
                <Eye className="w-4 h-4 text-[var(--navy-400)]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
