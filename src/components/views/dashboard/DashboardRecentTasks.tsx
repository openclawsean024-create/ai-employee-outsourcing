'use client';

import { ArrowRight, Plus, Receipt } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { fmtShortDate, fmtMoney } from '@/lib/utils';
import type { TaskLog, View } from '@/lib/types';

function EmptyTasks({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="card p-12 text-center">
      <div className="w-12 h-12 mx-auto rounded-lg bg-[var(--navy-50)] flex items-center justify-center mb-4">
        <Receipt className="w-6 h-6 text-[var(--navy-400)]" strokeWidth={1.5} />
      </div>
      <div className="text-h4 mb-2">還沒有任何任務</div>
      <p className="text-body-sm max-w-md mx-auto mb-6">
        建立第一個任務，從 144 種 AI Agent 中挑選 3-5 個，
        體驗多 Agent 協作完成一份結構化輸出。
      </p>
      <button onClick={onCreate} className="btn btn-primary">
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        建立第一個任務
      </button>
    </div>
  );
}

function statusBadgeClass(status: TaskLog['status']) {
  return status === 'success' ? 'badge-success' :
         status === 'failed' ? 'badge-danger' :
         status === 'partial' ? 'badge-warning' : 'badge-neutral';
}

function statusLabel(status: TaskLog['status']) {
  return status === 'success' ? '成功' :
         status === 'failed' ? '失敗' :
         status === 'partial' ? '部分' : '執行中';
}

export default function DashboardRecentTasks({ onNavigate }: { onNavigate: (v: View) => void }) {
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const recent = tasks.slice(-5).reverse();

  return (
    <section>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="text-micro mb-2">執行紀錄</div>
          <h2 className="text-h3">最近任務</h2>
        </div>
        <button onClick={() => onNavigate('tasks')} className="btn btn-ghost btn-sm">
          全部
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {tasks.length === 0 ? (
        <EmptyTasks onCreate={() => onNavigate('task_new')} />
      ) : (
        <div className="card divide-y divide-[var(--border-soft)]">
          {recent.map(t => (
            <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--cream-50)] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-body text-[var(--navy-900)] font-medium truncate">{t.taskName}</div>
                <div className="text-body-sm mt-0.5 truncate">
                  {t.agentNames.slice(0, 3).join(' · ')} · {fmtShortDate(t.createdAt)}
                </div>
              </div>
              <span className={`badge ${statusBadgeClass(t.status)}`}>
                {statusLabel(t.status)}
              </span>
              <div className="text-body-sm text-tabular w-20 text-right text-[var(--navy-700)]">{fmtMoney(t.totalCost)}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
