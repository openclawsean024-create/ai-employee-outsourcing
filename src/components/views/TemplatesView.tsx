'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAIEOStore } from '@/lib/store';
import { db } from '@/lib/db';
import { ALL_AGENTS } from '@/lib/agents';
import { Bookmark, Play, Trash2, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { cn, fmtShortDate } from '@/lib/utils';
import { runMultiAgentCollaboration } from '@/lib/orchestrator';

export default function TemplatesView() {
  const templates = useLiveQuery(() => db.templates.toArray()) || [];
  const settings = useAIEOStore(s => s.settings);
  const updateSettings = useAIEOStore(s => s.updateSettings);
  const setView = useAIEOStore(s => s.setView);
  const toggleAgentSelection = useAIEOStore(s => s.toggleAgentSelection);
  const clearAgentSelection = useAIEOStore(s => s.clearAgentSelection);
  const selectedIds = useAIEOStore(s => s.selectedAgentIds);
  const [running, setRunning] = useState<string | null>(null);

  async function runTemplate(templateId: string) {
    const tmpl = templates.find(t => t.id === templateId);
    if (!tmpl) return;

    clearAgentSelection();
    const agents = ALL_AGENTS.filter(a => tmpl.agentIds.includes(a.id));
    agents.forEach(a => toggleAgentSelection(a.id));

    setRunning(templateId);
    try {
      const results = await runMultiAgentCollaboration(agents, tmpl.defaultInput);
      const totalCost = results.reduce((s, r) => s + r.costNTD, 0);
      const totalDuration = results.reduce((s, r) => s + r.durationMs, 0);

      await db.tasks.add({
        id: `t_${Date.now()}`,
        taskName: tmpl.name,
        input: tmpl.defaultInput,
        agentIds: agents.map(a => a.id),
        agentNames: agents.map(a => a.displayName),
        results,
        status: results.every(r => r.status === 'success') ? 'success' : 'partial',
        totalCost,
        totalDurationMs: totalDuration,
        templateId: tmpl.id,
        templateName: tmpl.name,
        createdAt: new Date().toISOString(),
      });

      await db.templates.update(templateId, { usageCount: tmpl.usageCount + 1 });
      updateSettings({ ...settings, monthlyTaskUsed: settings.monthlyTaskUsed + 1 });
      clearAgentSelection();
      setView('tasks');
    } finally {
      setRunning(null);
    }
  }

  async function deleteTemplate(id: string) {
    await db.templates.delete(id);
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="text-micro mb-3">範本</div>
        <h1 className="text-h1 text-balance">
          好用的任務存起來，
          <br />
          <span className="text-[var(--brand)]">下次一鍵執行</span>
        </h1>
        <p className="text-body-lg mt-4 max-w-2xl">
          從「任務歷史」點儲存，或在「建立任務」完成後轉成範本。
          範本會記住使用的 Agent + 預設輸入文字。
        </p>
      </section>

      {templates.length === 0 ? (
        <div className="card p-12 text-center">
          <Bookmark className="w-10 h-10 mx-auto mb-3 text-[var(--navy-300)]" />
          <div className="text-h4 mb-2">還沒有任何範本</div>
          <p className="text-body-sm max-w-md mx-auto mb-6">
            完成一個任務後，可從「任務歷史」把它存成範本。
            下次相同工作直接一鍵執行，不用重新設定。
          </p>
          <button onClick={() => setView('task_new')} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            建立第一個任務
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(tmpl => (
            <div key={tmpl.id} className="card card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--brand-soft)] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[var(--brand)]" strokeWidth={1.75} />
                </div>
                <span className="badge badge-neutral">{tmpl.usageCount} 次執行</span>
              </div>

              <div className="text-h4 mb-1">{tmpl.name}</div>
              {tmpl.description && (
                <p className="text-body-sm mb-3 line-clamp-2">{tmpl.description}</p>
              )}

              <div className="text-body-sm text-[var(--navy-500)] mb-4 space-y-1">
                <div>{fmtShortDate(tmpl.createdAt)} · {tmpl.agentIds.length} 個 Agent</div>
              </div>

              <div className="text-body-sm text-[var(--navy-700)] bg-[var(--cream-50)] rounded-md p-2.5 mb-4 line-clamp-2">
                {tmpl.defaultInput}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => runTemplate(tmpl.id)}
                  disabled={running === tmpl.id}
                  className="btn btn-primary btn-sm flex-1"
                >
                  {running === tmpl.id ? (
                    '執行中...'
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" strokeWidth={2.5} />
                      一鍵執行
                    </>
                  )}
                </button>
                <button
                  onClick={() => deleteTemplate(tmpl.id)}
                  className="btn btn-ghost btn-sm text-[var(--danger)]"
                  title="刪除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}