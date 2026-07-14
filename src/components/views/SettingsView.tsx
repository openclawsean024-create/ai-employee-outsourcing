'use client';

import { useState } from 'react';
import { useAIEOStore } from '@/lib/store';
import { TIER_LABELS, TIER_LIMITS } from '@/lib/utils';
import { Save, Download, Upload, Key, Building, DollarSign } from 'lucide-react';
import { db } from '@/lib/db';

export default function SettingsView() {
  const settings = useAIEOStore(s => s.settings);
  const updateSettings = useAIEOStore(s => s.updateSettings);
  const [saved, setSaved] = useState(false);

  function showSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function exportData() {
    const tasks = await db.tasks.toArray();
    const templates = await db.templates.toArray();
    const data = { settings, tasks, templates, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-employee-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      if (data.settings) updateSettings(data.settings);
      if (data.tasks) {
        for (const t of data.tasks) await db.tasks.put(t);
      }
      if (data.templates) {
        for (const t of data.templates) await db.templates.put(t);
      }
      showSaved();
    } catch (err) {
      alert('匯入失敗：' + (err as Error).message);
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="text-micro mb-3">設定</div>
        <h1 className="text-h1">工作區與帳號</h1>
      </section>

      {/* Workspace */}
      <Section title="工作區" icon={Building}>
        <Field label="工作區名稱">
          <input
            type="text"
            value={settings.workspaceName}
            onChange={e => updateSettings({ workspaceName: e.target.value })}
            className="input"
            onBlur={showSaved}
          />
        </Field>
        <Field label="方案">
          <div className="card p-4 flex items-center justify-between">
            <div>
              <div className="text-h4">{TIER_LABELS[settings.tier]}</div>
              <div className="text-body-sm text-[var(--ink-500)] mt-0.5">
                {TIER_LIMITS[settings.tier].taskLimit === Infinity
                  ? '無限任務'
                  : `${TIER_LIMITS[settings.tier].taskLimit.toLocaleString()} 任務 / 月`}
              </div>
            </div>
            <span className="badge badge-brand">{settings.tier === 'free' ? '免費' : '已升級'}</span>
          </div>
        </Field>
      </Section>

      {/* Cost Limit */}
      <Section title="成本控制" icon={DollarSign}>
        <Field label={`單任務成本上限 · NT$ ${settings.defaultCostLimit}`}>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={settings.defaultCostLimit}
            onChange={e => updateSettings({ defaultCostLimit: Number(e.target.value) })}
            className="w-full accent-[var(--brand)]"
          />
          <div className="flex items-center justify-between text-body-sm text-[var(--ink-500)] mt-1">
            <span>NT$ 1</span>
            <span>NT$ 50</span>
          </div>
        </Field>
      </Section>

      {/* API Keys (future) */}
      <Section title="API 金鑰" icon={Key}>
        <p className="text-body-sm text-[var(--ink-500)] mb-4">
          連接你自己的 OpenAI / Anthropic API 金鑰可享有更便宜的模型成本。
          目前 Beta 版僅使用平台預載金鑰。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="password"
            placeholder="OpenAI API Key"
            disabled
            className="input opacity-50 cursor-not-allowed"
          />
          <input
            type="password"
            placeholder="Anthropic API Key"
            disabled
            className="input opacity-50 cursor-not-allowed"
          />
        </div>
        <div className="text-body-sm text-[var(--ink-500)] mt-2">
          Sprint 2 開放自訂金鑰功能
        </div>
      </Section>

      {/* Data */}
      <Section title="資料管理" icon={Save}>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportData} className="btn btn-secondary">
            <Download className="w-4 h-4" />
            匯出備份
          </button>
          <label className="btn btn-secondary cursor-pointer">
            <Upload className="w-4 h-4" />
            匯入備份
            <input type="file" accept="application/json" className="hidden" onChange={importData} />
          </label>
          {saved && (
            <span className="badge badge-success self-center">已儲存</span>
          )}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-[var(--ink-500)]" strokeWidth={1.75} />
        <div className="text-micro">{title}</div>
      </div>
      <div className="card p-6 space-y-5">
        {children}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-body-sm font-medium text-[var(--ink-700)] block mb-2">{label}</label>
      {children}
    </div>
  );
}