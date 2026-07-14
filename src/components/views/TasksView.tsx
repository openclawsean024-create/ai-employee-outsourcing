'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { fmtMoney, fmtDuration, fmtShortDate } from '@/lib/utils';
import { Search, Eye, X, Sparkles, AlertCircle } from 'lucide-react';
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">任務歷史</h2>
          <p className="text-sm text-slate-500 mt-1">共 {tasks.length} 筆 · 成功率 {tasks.length > 0 ? (successCount / tasks.length * 100).toFixed(0) : 0}% · 累計費用 {fmtMoney(totalCost)}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜尋任務名稱或 Agent..." className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          <option value="all">全部狀態</option>
          <option value="success">成功</option>
          <option value="partial">部分</option>
          <option value="failed">失敗</option>
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-12 text-sm bg-white border rounded-lg">尚無任務記錄</div>
        ) : (
          filtered.map(t => (
            <div key={t.id} className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-900 truncate">{t.taskName}</span>
                    <span className={cn('text-xs px-1.5 py-0.5 rounded', t.status === 'success' ? 'bg-emerald-100 text-emerald-700' : t.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')}>
                      {t.status === 'success' ? '成功' : t.status === 'partial' ? '部分' : '失敗'}
                    </span>
                    {t.templateName && <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">{t.templateName}</span>}
                  </div>
                  <div className="text-xs text-slate-500">
                    {fmtShortDate(t.createdAt)} · {t.agentNames.length} 個 Agent · {fmtMoney(t.totalCost)} · {fmtDuration(t.totalDurationMs)}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 truncate">{t.agentNames.join('、')}</div>
                </div>
                <button onClick={() => setViewing(t)} className="p-2 hover:bg-slate-100 rounded">
                  <Eye className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {viewing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900">{viewing.taskName}</h3>
                <div className="text-xs text-slate-500 mt-1">{fmtShortDate(viewing.createdAt)}</div>
              </div>
              <button onClick={() => setViewing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <div className="bg-slate-50 rounded-lg p-3 text-sm">
                <div className="font-medium text-slate-700 mb-1">任務輸入</div>
                <div className="text-slate-600 whitespace-pre-wrap">{viewing.input}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 rounded p-2">
                  <div className="text-xs text-slate-500">費用</div>
                  <div className="font-bold">{fmtMoney(viewing.totalCost)}</div>
                </div>
                <div className="bg-slate-50 rounded p-2">
                  <div className="text-xs text-slate-500">時間</div>
                  <div className="font-bold">{fmtDuration(viewing.totalDurationMs)}</div>
                </div>
                <div className="bg-slate-50 rounded p-2">
                  <div className="text-xs text-slate-500">Agent</div>
                  <div className="font-bold">{viewing.results.length}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-700">各 Agent 結果</div>
                {viewing.results.map((r, i) => (
                  <div key={i} className={cn('border-l-4 rounded p-3', r.status === 'success' ? 'border-emerald-500 bg-emerald-50/30' : 'border-rose-500 bg-rose-50/30')}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm">{r.agentName}</div>
                      <div className="text-xs text-slate-500">{fmtMoney(r.costNTD)} · {fmtDuration(r.durationMs)}</div>
                    </div>
                    {r.status === 'success' ? (
                      <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans">{r.output}</pre>
                    ) : (
                      <div className="text-xs text-rose-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{r.error}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
