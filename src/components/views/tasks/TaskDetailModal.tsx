'use client';

import { X } from 'lucide-react';
import { cn, fmtMoney, fmtDuration, fmtShortDate } from '@/lib/utils';
import type { TaskLog } from '@/lib/types';

interface Props {
  task: TaskLog | null;
  onClose: () => void;
}

export default function TaskDetailModal({ task, onClose }: Props) {
  if (!task) return null;

  return (
    <div
      className="fixed inset-0 bg-[var(--ink-900)]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-[var(--shadow-3)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[var(--border-soft)] flex justify-between items-start">
          <div>
            <div className="text-micro mb-2">{fmtShortDate(task.createdAt)}</div>
            <h3 className="text-h3">{task.taskName}</h3>
          </div>
          <button onClick={onClose} className="text-[var(--ink-400)] hover:text-[var(--ink-700)]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <div className="text-micro mb-2">任務輸入</div>
            <div className="card p-4 text-body whitespace-pre-wrap">{task.input}</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="card p-4 text-center">
              <div className="text-micro mb-1">費用</div>
              <div className="text-h3 text-tabular">{fmtMoney(task.totalCost)}</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-micro mb-1">時間</div>
              <div className="text-h3 text-tabular">{fmtDuration(task.totalDurationMs)}</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-micro mb-1">Agent</div>
              <div className="text-h3 text-tabular">{task.results.length}</div>
            </div>
          </div>

          <div>
            <div className="text-micro mb-3">各 Agent 結果</div>
            <div className="space-y-3">
              {task.results.map((r, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-body font-semibold">{r.agentName}</div>
                    <div className="flex items-center gap-2 text-body-sm text-[var(--ink-500)] text-tabular">
                      <span>{fmtMoney(r.costNTD)}</span>
                      <span>·</span>
                      <span>{fmtDuration(r.durationMs)}</span>
                      <span className={cn(
                        "badge ml-1",
                        r.status === 'success' ? 'badge-success' :
                        r.status === 'partial' ? 'badge-warning' : 'badge-danger'
                      )}>
                        {r.status === 'success' ? '成功' : r.status === 'partial' ? '部分' : '失敗'}
                      </span>
                    </div>
                  </div>
                  {r.status === 'success' ? (
                    <pre className="text-body-sm whitespace-pre-wrap font-sans text-[var(--ink-700)] leading-relaxed">{r.output}</pre>
                  ) : (
                    <div className="text-body-sm text-[var(--danger)]">{r.error}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
