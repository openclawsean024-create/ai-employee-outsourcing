'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useAIEOStore } from '@/lib/store';
import { getAgent } from '@/lib/agents';
import { fmtShortDate } from '@/lib/utils';
import { Bookmark, Play, Trash2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { TaskTemplate } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function TemplatesView() {
  const templates = useLiveQuery(() => db.templates.orderBy('createdAt').reverse().toArray()) || [];
  const deleteTemplate = useAIEOStore(s => s.deleteTemplate);
  const toggleAgentSelection = useAIEOStore(s => s.toggleAgentSelection);
  const clearAgentSelection = useAIEOStore(s => s.clearAgentSelection);
  const setView = useAIEOStore(s => s.setView);
  const [running, setRunning] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const runTemplate = async (tpl: TaskTemplate) => {
    clearAgentSelection();
    tpl.agentIds.forEach(id => toggleAgentSelection(id));
    setRunning(tpl.id);
    setResult(`已載入範本「${tpl.name}」的 ${tpl.agentIds.length} 個 Agent，請到「建立任務」頁執行。`);
    setTimeout(() => setView('task_new'), 800);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-indigo-600" />
          任務範本
        </h2>
        <p className="text-sm text-slate-500 mt-1">儲存常用的多 Agent 協作組合，一鍵執行</p>
      </div>

      {result && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="text-sm text-indigo-700">{result}</div>
          <button onClick={() => setResult(null)} className="text-indigo-600 text-xs hover:underline">關閉</button>
        </div>
      )}

      {templates.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <div className="text-slate-500 mb-2">尚無範本</div>
          <div className="text-xs text-slate-400 mb-4">到「建立任務」頁選擇 Agent 並儲存為範本，下次可一鍵執行</div>
          <button onClick={() => setView('task_new')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">前往建立任務</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map(tpl => {
            const agents = tpl.agentIds.map(id => getAgent(id)).filter(Boolean);
            return (
              <div key={tpl.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-slate-900">{tpl.name}</div>
                  <div className="text-xs text-slate-500">{tpl.usageCount} 次</div>
                </div>
                {tpl.description && <div className="text-xs text-slate-600 mb-3 line-clamp-2">{tpl.description}</div>}
                <div className="text-xs text-slate-500 mb-1">協作 Agent：</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {agents.map(a => (
                    <span key={a!.id} className="text-xs px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded">{a!.displayName}</span>
                  ))}
                </div>
                <div className="text-xs text-slate-500 mb-3">建立於 {fmtShortDate(tpl.createdAt)}</div>
                <div className="flex gap-1">
                  <button onClick={() => runTemplate(tpl)} className={cn('flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium', running === tpl.id ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700 text-white')}>
                    {running === tpl.id ? <><Sparkles className="w-3 h-3" />已載入</> : <><Play className="w-3 h-3" />執行</>}
                  </button>
                  <button onClick={() => { if (confirm(`確定刪除範本「${tpl.name}」？`)) deleteTemplate(tpl.id); }} className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
