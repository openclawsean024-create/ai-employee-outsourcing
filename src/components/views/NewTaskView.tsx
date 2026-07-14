'use client';

import { useState } from 'react';
import { useAIEOStore } from '@/lib/store';
import { ALL_AGENTS } from '@/lib/agents';
import { runMultiAgentCollaboration } from '@/lib/orchestrator';
import { db } from '@/lib/db';
import { ArrowLeft, X, Play, Bot, AlertCircle, Check, Loader2, Zap, FileText } from 'lucide-react';
import { cn, fmtMoney } from '@/lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';

export default function NewTaskView() {
  const selectedIds = useAIEOStore(s => s.selectedAgentIds);
  const toggleSelect = useAIEOStore(s => s.toggleAgentSelection);
  const setView = useAIEOStore(s => s.setView);
  const settings = useAIEOStore(s => s.settings);
  const updateSettings = useAIEOStore(s => s.updateSettings);
  const [taskName, setTaskName] = useState('');
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const [showAllAgents, setShowAllAgents] = useState(false);

  const selectedAgents = ALL_AGENTS.filter(a => selectedIds.includes(a.id));
  const estimatedCost = selectedAgents.length * 0.05;
  const overLimit = estimatedCost > settings.defaultCostLimit;
  const [acknowledgeOverLimit, setAcknowledgeOverLimit] = useState(false);

  const recentTasks = useLiveQuery(() =>
    db.tasks.orderBy('createdAt').reverse().limit(5).toArray()
  ) || [];

  async function handleRun() {
    if (!input.trim() || selectedAgents.length === 0) return;
    if (overLimit && !acknowledgeOverLimit) return;

    setRunning(true);
    try {
      const results = await runMultiAgentCollaboration(selectedAgents, input);
      const totalCost = results.reduce((s, r) => s + r.costNTD, 0);
      const totalDuration = results.reduce((s, r) => s + r.durationMs, 0);
      const allSuccess = results.every(r => r.status === 'success');
      const anyFailed = results.some(r => r.status === 'failed');

      await db.tasks.add({
        id: `t_${Date.now()}`,
        taskName: taskName || `任務 ${new Date().toLocaleString('zh-TW')}`,
        input,
        agentIds: selectedAgents.map(a => a.id),
        agentNames: selectedAgents.map(a => a.displayName),
        results,
        status: allSuccess ? 'success' : anyFailed && !allSuccess ? 'failed' : 'partial',
        totalCost,
        totalDurationMs: totalDuration,
        createdAt: new Date().toISOString(),
      });

      // Increment usage
      updateSettings({
        ...settings,
        monthlyTaskUsed: settings.monthlyTaskUsed + 1,
      });

      // Clear selection & redirect
      selectedIds.forEach(id => toggleSelect(id));
      setTaskName('');
      setInput('');
      setView('tasks');
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  }

  if (showAllAgents) {
    return (
      <div className="space-y-6">
        <button onClick={() => setShowAllAgents(false)} className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-4 h-4" />
          返回任務建立
        </button>
        <h2 className="text-h2">新增 Agent 到任務</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_AGENTS.map(agent => {
            const selected = selectedIds.includes(agent.id);
            return (
              <button
                key={agent.id}
                onClick={() => toggleSelect(agent.id)}
                className={cn(
                  "card p-4 text-left transition-all",
                  selected && "ring-2 ring-[var(--brand)] border-[var(--brand)]"
                )}
              >
                <div className="text-micro mb-2">{agent.categoryLabel}</div>
                <div className="text-h4 mb-1">{agent.displayName}</div>
                <p className="text-body-sm line-clamp-2">{agent.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="text-micro mb-3">建立任務</div>
        <h1 className="text-h1 text-balance">描述工作，3 秒開始</h1>
        <p className="text-body-lg mt-4 max-w-2xl">
          寫下任務內容，選 3-5 個 Agent 一起執行。
          完成後輸出會存到「任務歷史」可隨時回查。
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左：任務輸入 */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="text-micro block mb-2">任務名稱 (選填)</label>
            <input
              type="text"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              placeholder="例如：整理本週 IG 留言"
              className="input"
              disabled={running}
            />
          </div>

          <div>
            <label className="text-micro block mb-2">
              任務內容 <span className="text-[var(--danger)]">*</span>
            </label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="把要做的事情寫清楚。例如：把這 30 則留言分類（產品詢問 / 抱怨 / 一般互動），每類給我一段總結 + 個別回覆建議"
              rows={8}
              className="input py-2.5"
              style={{ resize: 'vertical', minHeight: 180, lineHeight: 1.6 }}
              disabled={running}
            />
            <div className="text-body-sm text-[var(--ink-500)] mt-2">
              {input.length} 字 · 越具體，輸出越準
            </div>
          </div>

          {/* Cost warning */}
          {overLimit && (
            <div className="card p-4 bg-[#FEF3C7] border-[var(--warning)]/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-body font-semibold text-[var(--ink-900)] mb-1">預估成本超過單任務上限</div>
                <div className="text-body-sm text-[var(--ink-700)]">
                  預估 NT${estimatedCost.toFixed(2)} &gt; 上限 NT${settings.defaultCostLimit}。
                  可提高上限，或精簡 Agent 數量。
                </div>
                <label className="flex items-center gap-2 mt-3 text-body-sm">
                  <input
                    type="checkbox"
                    checked={acknowledgeOverLimit}
                    onChange={e => setAcknowledgeOverLimit(e.target.checked)}
                    className="rounded"
                  />
                  了解，仍要執行
                </label>
              </div>
            </div>
          )}

          {/* Run button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleRun}
              disabled={!input.trim() || selectedAgents.length === 0 || running || (overLimit && !acknowledgeOverLimit)}
              className="btn btn-primary btn-lg"
            >
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  執行中...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" strokeWidth={2.5} />
                  開始執行 ({selectedAgents.length} Agent · ~NT${estimatedCost.toFixed(2)})
                </>
              )}
            </button>
            <button onClick={() => setView('agents')} className="btn btn-ghost">
              <Bot className="w-4 h-4" />
              從 Agent 庫挑選
            </button>
          </div>
        </div>

        {/* 右：已選 Agent + 上限設定 */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-baseline justify-between mb-4">
              <div className="text-micro">已選 Agent</div>
              <span className="text-h3 text-tabular">{selectedAgents.length}</span>
            </div>
            {selectedAgents.length === 0 ? (
              <div className="text-center py-6">
                <Bot className="w-8 h-8 mx-auto mb-2 text-[var(--ink-300)]" />
                <div className="text-body-sm text-[var(--ink-500)] mb-3">尚未選任何 Agent</div>
                <button onClick={() => setShowAllAgents(true)} className="btn btn-secondary btn-sm">
                  挑選 Agent
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-3 max-h-72 overflow-y-auto">
                  {selectedAgents.map(a => (
                    <div key={a.id} className="flex items-center gap-2 py-1.5">
                      <div className="w-7 h-7 rounded-md bg-[var(--brand-soft)] flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 text-[var(--brand)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-body-sm font-medium truncate">{a.displayName}</div>
                      </div>
                      <button
                        onClick={() => toggleSelect(a.id)}
                        className="text-[var(--ink-400)] hover:text-[var(--ink-700)]"
                        disabled={running}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowAllAgents(true)} className="btn btn-secondary btn-sm w-full">
                  從 Agent 庫新增
                </button>
              </>
            )}
          </div>

          <div className="card p-5">
            <div className="text-micro mb-3">成本上限</div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-h2 text-tabular">NT${settings.defaultCostLimit}</span>
              <span className="text-body-sm text-[var(--ink-500)]">/ 任務</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={settings.defaultCostLimit}
              onChange={e => updateSettings({ ...settings, defaultCostLimit: Number(e.target.value) })}
              className="w-full accent-[var(--brand)]"
            />
            <div className="text-body-sm text-[var(--ink-500)] mt-1">
              超過會要求確認
            </div>
          </div>

          {recentTasks.length > 0 && (
            <div className="card p-5">
              <div className="text-micro mb-3">最近任務</div>
              <div className="space-y-2">
                {recentTasks.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[var(--ink-400)] flex-shrink-0" />
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
          )}
        </div>
      </div>
    </div>
  );
}