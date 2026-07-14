'use client';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAIEOStore } from '@/lib/store';
import { db } from '@/lib/db';
import { ALL_AGENTS, AGENT_CATEGORIES } from '@/lib/agents';
import { fmtNumber, fmtMoney, fmtShortDate, TIER_LABELS, TIER_LIMITS } from '@/lib/utils';
import { Bot, Sparkles, Receipt, Bookmark, TrendingUp, Plus, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DashboardView() {
  const settings = useAIEOStore(s => s.settings);
  const setView = useAIEOStore(s => s.setView);
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const templates = useLiveQuery(() => db.templates.toArray()) || [];

  const tierLimit = TIER_LIMITS[settings.tier];
  const usagePct = (settings.monthlyTaskUsed / tierLimit.taskLimit * 100).toFixed(1);
  const totalCost = tasks.reduce((s, t) => s + t.totalCost, 0);
  const successTasks = tasks.filter(t => t.status === 'success').length;
  const savedHours = tasks.length * 0.5;  // 估計每任務省 30 分鐘

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">歡迎回來 👋</h2>
          <p className="text-sm text-slate-500 mt-1">{settings.workspaceName} · {TIER_LABELS[settings.tier]}</p>
        </div>
        <button onClick={() => setView('task_new')} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" />
          新建任務
        </button>
      </div>

      {/* 核心指標 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Receipt} label="本月任務" value={fmtNumber(settings.monthlyTaskUsed)} sub={`/ ${tierLimit.taskLimit}`} color="indigo" />
        <Stat icon={TrendingUp} label="成功率" value={tasks.length > 0 ? `${(successTasks / tasks.length * 100).toFixed(0)}%` : '—'} sub={`${successTasks} / ${tasks.length}`} color="emerald" />
        <Stat icon={Zap} label="節省時間" value={`${savedHours.toFixed(1)}h`} sub="預估" color="amber" />
        <Stat icon={Sparkles} label="累計費用" value={fmtMoney(totalCost)} sub="純前端 demo" color="purple" />
      </div>

      {/* 用量進度條 */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-slate-700">本月用量</div>
          <div className="text-xs text-slate-500">{usagePct}%</div>
        </div>
        <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all" style={{ width: `${Math.min(100, parseFloat(usagePct))}%` }} />
        </div>
        <div className="text-xs text-slate-500 mt-2">{settings.monthlyTaskUsed} / {tierLimit.taskLimit} 任務 · {TIER_LABELS[settings.tier]} 方案</div>
      </div>

      {/* 三大 CTA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button onClick={() => setView('agents')} className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-lg p-5 text-left hover:shadow-lg transition-shadow">
          <Bot className="w-6 h-6 mb-2" />
          <div className="font-semibold">瀏覽 144 種 AI Agent</div>
          <div className="text-xs opacity-80 mt-1">10 大類 · {ALL_AGENTS.length} 個預載</div>
        </button>
        <button onClick={() => setView('task_new')} className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg p-5 text-left hover:shadow-lg transition-shadow">
          <Zap className="w-6 h-6 mb-2" />
          <div className="font-semibold">建立多 Agent 任務</div>
          <div className="text-xs opacity-80 mt-1">1 任務同時呼叫 3-5 個 Agent</div>
        </button>
        <button onClick={() => setView('templates')} className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-lg p-5 text-left hover:shadow-lg transition-shadow">
          <Bookmark className="w-6 h-6 mb-2" />
          <div className="font-semibold">使用範本一鍵執行</div>
          <div className="text-xs opacity-80 mt-1">{templates.length} 個已儲存範本</div>
        </button>
      </div>

      {/* Agent 類別總覽 */}
      <div className="bg-white border rounded-lg p-4">
        <div className="text-sm font-medium text-slate-700 mb-3">10 大類 AI Agent</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {AGENT_CATEGORIES.map(cat => {
            const count = ALL_AGENTS.filter(a => a.category === cat.key).length;
            const colorClass = { emerald: 'bg-emerald-100 text-emerald-700', rose: 'bg-rose-100 text-rose-700', purple: 'bg-purple-100 text-purple-700', amber: 'bg-amber-100 text-amber-700', indigo: 'bg-indigo-100 text-indigo-700', sky: 'bg-sky-100 text-sky-700', pink: 'bg-pink-100 text-pink-700', slate: 'bg-slate-100 text-slate-700', lime: 'bg-lime-100 text-lime-700', cyan: 'bg-cyan-100 text-cyan-700' }[cat.color];
            return (
              <button key={cat.key} onClick={() => setView('agents')} className="bg-slate-50 hover:bg-slate-100 rounded-lg p-3 text-left transition-colors">
                <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>{cat.label}</div>
                <div className="text-2xl font-bold text-slate-900 mt-2">{count}</div>
                <div className="text-xs text-slate-500">個 Agent</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 最近任務 */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-slate-700">最近任務</div>
          <button onClick={() => setView('tasks')} className="text-xs text-indigo-600 hover:underline">查看全部 →</button>
        </div>
        {tasks.length === 0 ? (
          <div className="text-center text-slate-400 py-8 text-sm">尚無任務。點擊「建立任務」開始！</div>
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{t.taskName}</div>
                  <div className="text-xs text-slate-500">{fmtShortDate(t.createdAt)} · {t.agentNames.join('、')}</div>
                </div>
                <div className="text-right ml-3">
                  <div className={`text-xs px-2 py-0.5 rounded ${t.status === 'success' ? 'bg-emerald-100 text-emerald-700' : t.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                    {t.status === 'success' ? '成功' : t.status === 'partial' ? '部分' : '失敗'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{fmtMoney(t.totalCost)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string; sub?: string; color: 'indigo' | 'emerald' | 'amber' | 'purple' }) {
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
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}
