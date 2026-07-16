'use client';

import { Play, AlertCircle, Bot, Loader2 } from 'lucide-react';
import type { AIAgent, UserSettings, View } from '@/lib/types';

interface Props {
  taskName: string;
  setTaskName: (v: string) => void;
  input: string;
  setInput: (v: string) => void;
  running: boolean;
  selectedAgents: AIAgent[];
  estimatedCost: number;
  overLimit: boolean;
  acknowledgeOverLimit: boolean;
  setAcknowledgeOverLimit: (v: boolean) => void;
  onRun: () => void;
  setView: (v: View) => void;
  settings: UserSettings;
}

export default function TaskInputPanel(props: Props) {
  const {
    taskName, setTaskName, input, setInput, running, selectedAgents,
    estimatedCost, overLimit, acknowledgeOverLimit, setAcknowledgeOverLimit,
    onRun, setView, settings,
  } = props;

  return (
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
        <div className="text-body-sm text-[var(--navy-500)] mt-2">
          {input.length} 字 · 越具體，輸出越準
        </div>
      </div>

      {/* Cost warning */}
      {overLimit && (
        <div data-testid="cost-warning" className="card p-4 bg-[var(--warning-soft)] border-[var(--warning)]/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-body font-semibold text-[var(--navy-900)] mb-1">預估成本超過單任務上限</div>
            <div className="text-body-sm text-[var(--navy-700)]">
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
          onClick={onRun}
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
  );
}
