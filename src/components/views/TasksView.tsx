'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { fmtMoney, fmtDuration, fmtShortDate } from '@/lib/utils';
import { Search, Eye, X, ArrowRight, FileText } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { TaskLog } from '@/lib/types';

export default function TasksView() {
  const tasks = useLiveQuery(() => db.tasks.orderBy('createdAt').reverse().toArray()) || [];
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'partial' | 'failed'>('all');
  const [viewing, setViewing] = useState<TaskLog | null>(null);

  const filtered = tasks.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (q && !t.taskName.toLowerCase().includes(q.toLowerCase()) && !t.agentNames.some(n => n.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const totalCost = tasks.reduce((s, t) => s + t.totalCost, 0);
  const successCount = tasks.filter(t => t.status === 'success').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="text-micro mb-3">任務歷史</div>
        <h1 className="text-h1 text-balance">
          {tasks.length} 筆任務
          <span className="text-[var(--ink-500)] font-normal">，成功率 {tasks.length > 0 ? Math.round(successCount / tasks.length * 100) : 0}%</span>
        </h1>
        <p className="text-body-lg mt-3">
          累計花費 {fmtMoney(totalCost)} · 每一筆都可重新檢視輸出
        </p>
      </section>

      {/* Filters */}
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
          {[
            { v: 'all', l: '全部' },
            { v: 'success', l: '成功' },
            { v: 'partial', l: '部分' },
            { v: 'failed', l: '失敗' },
          ].map(opt => (
            <button
              key={opt.v}
              onClick={() => setStatusFilter(opt.v as any)}
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

      {/* Task table */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-10 h-10 mx-auto mb-3 text-[var(--ink-300)]" />
          <div className="text-h4 mb-2">{tasks.length === 0 ? '還沒有任何任務' : '沒有符合的任務'}</div>
          <p className="text-body-sm">建立第一個任務，看 Agent 怎麼協作輸出</p>
        </div>
      ) : (
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
              {filtered.map((t, i) => (
                <tr
                  key={t.id}
                  className={cn(
                    "border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--ink-25)] transition-colors cursor-pointer",
                    i % 2 === 1 && "bg-[var(--ink-25)]/30"
                  )}
                  onClick={() => setViewing(t)}
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
      )}

      {/* Modal */}
      {viewing && (
        <div
          className="fixed inset-0 bg-[var(--ink-900)]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-[var(--shadow-3)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-[var(--border-soft)] flex justify-between items-start">
              <div>
                <div className="text-micro mb-2">{fmtShortDate(viewing.createdAt)}</div>
                <h3 className="text-h3">{viewing.taskName}</h3>
              </div>
              <button onClick={() => setViewing(null)} className="text-[var(--ink-400)] hover:text-[var(--ink-700)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <div className="text-micro mb-2">任務輸入</div>
                <div className="card p-4 text-body whitespace-pre-wrap">{viewing.input}</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="card p-4 text-center">
                  <div className="text-micro mb-1">費用</div>
                  <div className="text-h3 text-tabular">{fmtMoney(viewing.totalCost)}</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-micro mb-1">時間</div>
                  <div className="text-h3 text-tabular">{fmtDuration(viewing.totalDurationMs)}</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-micro mb-1">Agent</div>
                  <div className="text-h3 text-tabular">{viewing.results.length}</div>
                </div>
              </div>

              <div>
                <div className="text-micro mb-3">各 Agent 結果</div>
                <div className="space-y-3">
                  {viewing.results.map((r, i) => (
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
      )}
    </div>
  );
}