'use client';
import { useState } from 'react';
import { useAIEOStore } from '@/lib/store';
import { Save, AlertCircle } from 'lucide-react';
import { TIER_LABELS, TIER_LIMITS } from '@/lib/utils';

export default function SettingsView() {
  const settings = useAIEOStore(s => s.settings);
  const updateSettings = useAIEOStore(s => s.updateSettings);
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">系統設定</h2>
      <p className="text-sm text-slate-500 mb-4">工作區、訂閱方案、API 金鑰</p>

      <div className="bg-white border rounded-lg p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-3">工作區</h3>
          <div className="space-y-3">
            <Field label="工作區名稱" value={draft.workspaceName} onChange={(v) => setDraft({ ...draft, workspaceName: v })} />
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-3">訂閱方案</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['free', 'kol', 'pro', 'enterprise'] as const).map(tier => {
              const limit = TIER_LIMITS[tier];
              const selected = draft.tier === tier;
              return (
                <button key={tier} onClick={() => setDraft({ ...draft, tier, monthlyTaskLimit: limit.taskLimit })} className={`text-left p-3 rounded-lg border-2 transition-colors ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="font-semibold text-sm text-slate-900">{TIER_LABELS[tier]}</div>
                  <div className="text-xs text-slate-500 mt-1">{limit.price}</div>
                  <div className="text-xs text-slate-600 mt-2">{limit.agentLimit === 144 ? '144' : limit.agentLimit} Agent · {limit.taskLimit} 任務/月</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-3">任務費用上限</h3>
          <div>
            <label className="block text-sm font-medium mb-1">單任務預設上限 (NT$)</label>
            <input type="number" step="1" value={draft.defaultCostLimit} onChange={(e) => setDraft({ ...draft, defaultCostLimit: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm" />
            <div className="text-xs text-slate-500 mt-1">預設 NT$5 / 任務（依 SPEC §5.2）</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-3">API 金鑰（v2 真實模式用）</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">OpenAI API Key</label>
              <input type="password" value={draft.apiKeyOpenAI || ''} onChange={(e) => setDraft({ ...draft, apiKeyOpenAI: e.target.value })} placeholder="sk-..." className="w-full px-3 py-2 border rounded-lg text-sm font-mono" />
              <div className="text-xs text-slate-500 mt-1">MVP 為 mock 模式，金鑰僅儲存於 localStorage</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Anthropic API Key</label>
              <input type="password" value={draft.apiKeyClaude || ''} onChange={(e) => setDraft({ ...draft, apiKeyClaude: e.target.value })} placeholder="sk-ant-..." className="w-full px-3 py-2 border rounded-lg text-sm font-mono" />
            </div>
          </div>
        </div>

        <div className="border-t pt-4 flex items-center gap-3">
          <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
            <Save className="w-4 h-4" />
            儲存設定
          </button>
          {saved && <span className="text-sm text-emerald-600">✓ 已儲存</span>}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-amber-900">MVP 模式說明</div>
            <div className="text-xs text-amber-700 mt-1">
              本 MVP 為純前端 mock 模式，不會呼叫真實 OpenAI / Anthropic API。
              Agent 會根據角色產生合理的範例輸出。v2.0 將整合真實 API（需填入金鑰）。
              所有資料儲存於瀏覽器 localStorage 與 IndexedDB。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
    </div>
  );
}
