'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useAIEOStore } from '@/lib/store';
import { ALL_AGENTS, getAgent } from '@/lib/agents';
import { fmtMoney, fmtNumber, fmtShortDate, TIER_LIMITS, TIER_LABELS } from '@/lib/utils';
import { BarChart3, Download, Upload, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { useState } from 'react';

export default function UsageView() {
  const settings = useAIEOStore(s => s.settings);
  const exportData = useAIEOStore(s => s.exportData);
  const importData = useAIEOStore(s => s.importData);
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const templates = useLiveQuery(() => db.templates.toArray()) || [];
  const [importMsg, setImportMsg] = useState('');

  const tierLimit = TIER_LIMITS[settings.tier];
  const totalCost = tasks.reduce((s, t) => s + t.totalCost, 0);
  const savedHours = tasks.length * 0.5;
  const successRate = tasks.length > 0 ? (tasks.filter(t => t.status === 'success').length / tasks.length * 100) : 0;

  // Agent 使用排行
  const agentUsage: Record<string, { name: string; count: number; cost: number }> = {};
  tasks.forEach(t => {
    t.results.forEach(r => {
      if (!agentUsage[r.agentId]) agentUsage[r.agentId] = { name: r.agentName, count: 0, cost: 0 };
      agentUsage[r.agentId].count += 1;
      agentUsage[r.agentId].cost += r.costNTD;
    });
  });
  const topAgents = Object.values(agentUsage).sort((a, b) => b.count - a.count).slice(0, 10);

  const handleExport = async () => {
    const json = await exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aieo-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      try {
        await importData(text);
        setImportMsg('✓ 匯入成功');
        setTimeout(() => setImportMsg(''), 3000);
      } catch (err) {
        setImportMsg('✗ 匯入失敗：格式錯誤');
      }
    };
    input.click();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            用量與報表
          </h2>
          <p className="text-sm text-slate-500 mt-1">{TIER_LABELS[settings.tier]} · {TIER_LIMITS[settings.tier].price}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">
            <Download className="w-4 h-4" />匯出 JSON
          </button>
          <button onClick={handleImport} className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">
            <Upload className="w-4 h-4" />匯入 JSON
          </button>
        </div>
      </div>

      {importMsg && (
        <div className={cn('rounded-lg p-3 text-sm', importMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>
          {importMsg}
        </div>
      )}

      {/* 核心指標 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Sparkles} label="總任務數" value={fmtNumber(tasks.length)} color="indigo" />
        <Stat icon={TrendingUp} label="成功率" value={`${successRate.toFixed(0)}%`} color="emerald" />
        <Stat icon={Clock} label="節省時間" value={`${savedHours.toFixed(1)}h`} color="amber" />
        <Stat icon={BarChart3} label="累計費用" value={fmtMoney(totalCost)} color="purple" />
      </div>

      {/* 用量 */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-slate-700">本月用量</div>
          <div className="text-xs text-slate-500">{settings.monthlyTaskUsed} / {tierLimit.taskLimit}</div>
        </div>
        <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all" style={{ width: `${Math.min(100, settings.monthlyTaskUsed / tierLimit.taskLimit * 100)}%` }} />
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs">
          <div><div className="text-slate-500">方案</div><div className="font-bold">{TIER_LABELS[settings.tier]}</div></div>
          <div><div className="text-slate-500">Agent 上限</div><div className="font-bold">{tierLimit.agentLimit === 144 ? '144' : tierLimit.agentLimit}</div></div>
          <div><div className="text-slate-500">任務上限</div><div className="font-bold">{tierLimit.taskLimit}</div></div>
          <div><div className="text-slate-500">已用</div><div className="font-bold text-indigo-600">{settings.monthlyTaskUsed}</div></div>
        </div>
      </div>

      {/* 最常用 Agent */}
      <div className="bg-white border rounded-lg p-4">
        <div className="text-sm font-medium text-slate-700 mb-3">最常用 AI Agent TOP 10</div>
        {topAgents.length === 0 ? (
          <div className="text-center text-slate-400 py-8 text-sm">尚無使用記錄</div>
        ) : (
          <div className="space-y-1.5">
            {topAgents.map((a, i) => {
              const max = topAgents[0].count;
              return (
                <div key={a.name} className="flex items-center gap-3">
                  <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold', i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-700' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600')}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium text-slate-900 truncate">{a.name}</div>
                      <div className="text-xs text-slate-500 ml-2">{a.count} 次 · {fmtMoney(a.cost)}</div>
                    </div>
                    <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${(a.count / max) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 範本統計 */}
      <div className="bg-white border rounded-lg p-4">
        <div className="text-sm font-medium text-slate-700 mb-3">範本統計</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-slate-900">{templates.length}</div>
            <div className="text-xs text-slate-500 mt-1">已儲存範本</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-slate-900">{templates.reduce((s, t) => s + t.usageCount, 0)}</div>
            <div className="text-xs text-slate-500 mt-1">範本總使用次數</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-slate-900">{ALL_AGENTS.length}</div>
            <div className="text-xs text-slate-500 mt-1">總預載 Agent</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: 'indigo' | 'emerald' | 'amber' | 'purple' }) {
  const colors = { indigo: 'bg-indigo-50 text-indigo-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600', purple: 'bg-purple-50 text-purple-600' };
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-slate-500">{label}</div>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
