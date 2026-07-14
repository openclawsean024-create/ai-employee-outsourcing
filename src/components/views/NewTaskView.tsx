'use client';
import { useState } from 'react';
import { useAIEOStore } from '@/lib/store';
import { getAgent } from '@/lib/agents';
import { fmtMoney, fmtDuration } from '@/lib/utils';
import type { TaskLog } from '@/lib/types';
import { Sparkles, Plus, X, Loader2, Bookmark, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewTaskView() {
  const selectedAgentIds = useAIEOStore(s => s.selectedAgentIds);
  const toggleAgentSelection = useAIEOStore(s => s.toggleAgentSelection);
  const clearAgentSelection = useAIEOStore(s => s.clearAgentSelection);
  const runTask = useAIEOStore(s => s.runTask);
  const saveAsTemplate = useAIEOStore(s => s.saveAsTemplate);
  const isExecuting = useAIEOStore(s => s.isExecuting);
  const settings = useAIEOStore(s => s.settings);

  const [taskName, setTaskName] = useState('');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<TaskLog | null>(null);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [tplName, setTplName] = useState('');
  const [tplDesc, setTplDesc] = useState('');

  const selectedAgents = selectedAgentIds.map(id => getAgent(id)).filter(Boolean);

  const handleRun = async () => {
    if (selectedAgents.length === 0 || !input.trim()) {
      alert('請選擇至少 1 個 Agent 並輸入任務內容');
      return;
    }
    setResult(null);
    const task = await runTask(input, taskName || '未命名任務');
    if (task) setResult(task);
  };

  const handleSaveTemplate = async () => {
    if (!tplName.trim()) {
      alert('請輸入範本名稱');
      return;
    }
    await saveAsTemplate(tplName, tplDesc, input);
    setShowSaveTemplate(false);
    setTplName('');
    setTplDesc('');
    alert('範本已儲存！');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          建立任務
        </h2>
        <p className="text-sm text-slate-500 mt-1">選擇 3-5 個 AI Agent 協作執行任務，並儲存為範本下次一鍵執行</p>
      </div>

      <div className="bg-white border rounded-lg p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">任務名稱</label>
          <input value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="例如：整理 IG 留言 + 客服回覆 + 摘要報告" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            已選 Agent <span className="text-xs text-slate-500">（{selectedAgents.length} 個）</span>
          </label>
          {selectedAgents.length === 0 ? (
            <div className="text-sm text-slate-400 px-3 py-4 border-2 border-dashed border-slate-200 rounded-lg text-center">
              尚未選擇 Agent。請到 <button onClick={() => useAIEOStore.getState().setView('agents')} className="text-indigo-600 hover:underline">AI Agent 庫</button> 選擇。
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedAgents.map(agent => (
                <span key={agent!.id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
                  {agent!.displayName}
                  <button onClick={() => toggleAgentSelection(agent!.id)} className="hover:bg-indigo-100 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedAgents.length > 0 && (
                <button onClick={clearAgentSelection} className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1">清除全部</button>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">任務內容</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} placeholder="請輸入任務內容...&#10;例如：整理過去 7 天 IG 留言，產出客服回覆建議、文案摘要、數據統計" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          <div className="text-xs text-slate-500 mt-1">預估費用上限 NT${settings.defaultCostLimit} / 任務</div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button onClick={() => setShowSaveTemplate(true)} disabled={selectedAgents.length === 0 || !input.trim()} className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 font-medium text-sm">
            <Bookmark className="w-4 h-4" />
            儲存為範本
          </button>
          <button onClick={handleRun} disabled={isExecuting || selectedAgents.length === 0 || !input.trim()} className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 font-medium text-sm">
            {isExecuting ? <><Loader2 className="w-4 h-4 animate-spin" />執行中...</> : <><Sparkles className="w-4 h-4" />執行多 Agent 協作</>}
          </button>
        </div>
      </div>

      {/* 執行結果 */}
      {result && (
        <div className="bg-white border rounded-lg p-5 mt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-lg font-bold text-slate-900">{result.taskName}</div>
              <div className="text-xs text-slate-500 mt-1">狀態：{result.status === 'success' ? '全部成功' : result.status === 'partial' ? '部分失敗' : '全部失敗'} · 總費用 {fmtMoney(result.totalCost)} · 總時間 {fmtDuration(result.totalDurationMs)}</div>
            </div>
            <span className={cn('px-3 py-1 rounded-full text-xs font-medium', result.status === 'success' ? 'bg-emerald-100 text-emerald-700' : result.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')}>
              {result.status === 'success' ? '✓ 成功' : result.status === 'partial' ? '⚠ 部分' : '✗ 失敗'}
            </span>
          </div>

          <div className="space-y-3">
            {result.results.map((r, i) => (
              <div key={i} className={cn('border-l-4 rounded-lg p-3', r.status === 'success' ? 'border-emerald-500 bg-emerald-50/30' : r.status === 'failed' ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300 bg-slate-50')}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">{r.agentName}</span>
                    <span className={cn('text-xs px-1.5 py-0.5 rounded', r.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')}>
                      {r.status === 'success' ? '成功' : '失敗'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{fmtMoney(r.costNTD)} · {fmtDuration(r.durationMs)}</div>
                </div>
                {r.status === 'success' ? (
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans bg-white p-2 rounded">{r.output}</pre>
                ) : (
                  <div className="text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {r.error}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 彙整報告 */}
          {result.status === 'success' && result.results.length > 1 && (
            <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <div className="font-semibold text-sm text-indigo-900">彙整報告</div>
              </div>
              <div className="text-sm text-indigo-800">
                本次任務由 <strong>{result.agentNames.length}</strong> 個 AI Agent 協作完成。
                總耗時 <strong>{fmtDuration(result.totalDurationMs)}</strong>，費用 <strong>{fmtMoney(result.totalCost)}</strong>。
                {result.results.filter(r => r.status === 'success').length} 個 Agent 成功產出，總輸出 {result.results.reduce((s, r) => s + r.output.length, 0)} 字元。
              </div>
            </div>
          )}
        </div>
      )}

      {/* 儲存範本 Modal */}
      {showSaveTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">儲存為範本</h3>
              <button onClick={() => setShowSaveTemplate(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">範本名稱 *</label>
                <input value={tplName} onChange={(e) => setTplName(e.target.value)} placeholder="例如：每週 IG 留言整理" className="w-full px-3 py-2 border rounded-lg text-sm" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">描述</label>
                <textarea value={tplDesc} onChange={(e) => setTplDesc(e.target.value)} rows={2} placeholder="簡短描述這個範本的用途" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="text-xs text-slate-500">已選 {selectedAgents.length} 個 Agent，下次可一鍵執行</div>
            </div>
            <div className="p-3 border-t grid grid-cols-2 gap-2">
              <button onClick={() => setShowSaveTemplate(false)} className="px-4 py-2 border rounded-lg text-sm">取消</button>
              <button onClick={handleSaveTemplate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">儲存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
