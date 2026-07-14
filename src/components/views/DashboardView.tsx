'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useAIEOStore } from '@/lib/store';
import { db } from '@/lib/db';
import { ALL_AGENTS, AGENT_CATEGORIES } from '@/lib/agents';
import { fmtNumber, fmtMoney, fmtShortDate, TIER_LABELS, TIER_LIMITS } from '@/lib/utils';
import { Bot, Plus, Receipt, Bookmark, ArrowRight, Sparkles } from 'lucide-react';

export default function DashboardView() {
  const settings = useAIEOStore(s => s.settings);
  const setView = useAIEOStore(s => s.setView);
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const templates = useLiveQuery(() => db.templates.toArray()) || [];

  const tierLimit = TIER_LIMITS[settings.tier];
  const usagePct = Math.min(100, (settings.monthlyTaskUsed / tierLimit.taskLimit) * 100);
  const totalCost = tasks.reduce((s, t) => s + t.totalCost, 0);
  const successTasks = tasks.filter(t => t.status === 'success').length;
  const savedHours = tasks.length * 0.5;

  return (
    <div className="space-y-10">
      {/* === Hero === */}
      <section>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-micro mb-3">儀表板</div>
            <h1 className="text-h2 md:text-h1">
              你好，{settings.workspaceName}
            </h1>
            <p className="text-meta mt-2">
              {TIER_LABELS[settings.tier]} · 本月 {fmtNumber(settings.monthlyTaskUsed)} / {fmtNumber(tierLimit.taskLimit)} 任務
            </p>
          </div>
          <button onClick={() => setView('task_new')} className="btn btn-primary flex-shrink-0">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">建立任務</span>
          </button>
        </div>
      </section>

      {/* === 4 指標 === */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric label="本月任務" value={fmtNumber(settings.monthlyTaskUsed)} sub={`/ ${fmtNumber(tierLimit.taskLimit)}`} />
          <Metric label="成功率" value={tasks.length > 0 ? `${Math.round(successTasks / tasks.length * 100)}%` : '—'} sub={`${successTasks} / ${tasks.length}`} />
          <Metric label="節省時間" value={`${savedHours.toFixed(1)}h`} sub="預估" />
          <Metric label="累計費用" value={fmtMoney(totalCost)} sub="本月" />
        </div>
      </section>

      {/* === 用量 + 三大 CTA === */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* 用量卡片 */}
        <div className="card p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="text-micro">本月用量</div>
            <div className="text-meta tabular-nums">{usagePct.toFixed(1)}%</div>
          </div>
          <div className="h-1.5 bg-[var(--ink-50)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--ink-900)] transition-all duration-500" style={{ width: `${usagePct}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-meta">
            <span>{fmtNumber(settings.monthlyTaskUsed)} / {fmtNumber(tierLimit.taskLimit)}</span>
            <span>{TIER_LABELS[settings.tier]}</span>
          </div>
        </div>

        {/* 3 個 CTA */}
        <CTACard
          icon={Bot}
          title="瀏覽 144 種 AI Agent"
          sub="10 大類別 · 隨選即用"
          onClick={() => setView('agents')}
          accent
        />
        <CTACard
          icon={Sparkles}
          title="建立多 Agent 任務"
          sub="1 任務同步呼叫 3-5 個"
          onClick={() => setView('task_new')}
        />
      </section>

      {/* === 10 大類 Agent === */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-h3">10 大類 AI Agent</h2>
          <button onClick={() => setView('agents')} className="btn btn-ghost btn-sm">
            查看全部
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {AGENT_CATEGORIES.map(cat => {
            const count = ALL_AGENTS.filter(a => a.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => setView('agents')}
                className="card card-hover p-4 text-left group"
              >
                <div className="text-meta mb-2">{cat.label}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-h3 tabular-nums">{count}</span>
                  <span className="text-meta">Agent</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--ink-300)] mt-3 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--ink-700)]" />
              </button>
            );
          })}
        </div>
      </section>

      {/* === 最近任務 === */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-h3">最近任務</h2>
          <button onClick={() => setView('tasks')} className="btn btn-ghost btn-sm">
            查看全部
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {tasks.length === 0 ? (
          <EmptyTasks onCreate={() => setView('task_new')} />
        ) : (
          <div className="card divide-y divide-[var(--ink-100)]">
            {tasks.slice(-5).reverse().map(t => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--ink-25)] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-body text-[var(--ink-900)] truncate">{t.taskName}</div>
                  <div className="text-meta mt-0.5 truncate">
                    {t.agentNames.join(' · ')} · {fmtShortDate(t.createdAt)}
                  </div>
                </div>
                <span className={`badge ${
                  t.status === 'success' ? 'badge-success' :
                  t.status === 'failed' ? 'badge-danger' :
                  t.status === 'partial' ? 'badge-warning' : 'badge-neutral'
                }`}>
                  {t.status === 'success' ? '成功' : t.status === 'failed' ? '失敗' : t.status === 'partial' ? '部分' : '執行中'}
                </span>
                <div className="text-meta tabular-nums w-20 text-right">{fmtMoney(t.totalCost)}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// === Sub Components ===

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-5">
      <div className="text-micro mb-3">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-h2 tabular-nums">{value}</span>
        {sub && <span className="text-meta">{sub}</span>}
      </div>
    </div>
  );
}

function CTACard({ icon: Icon, title, sub, onClick, accent }: {
  icon: React.ElementType;
  title: string;
  sub: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`card card-hover p-5 text-left group flex flex-col justify-between min-h-[120px] ${
        accent ? 'bg-[var(--ink-900)] border-[var(--ink-900)] text-white' : ''
      }`}
    >
      <Icon className={`w-5 h-5 ${accent ? 'text-white' : 'text-[var(--ink-700)]'}`} strokeWidth={1.75} />
      <div>
        <div className={`text-h4 ${accent ? 'text-white' : 'text-[var(--ink-900)]'}`}>{title}</div>
        <div className={`text-meta mt-1 ${accent ? 'text-[var(--ink-300)]' : ''}`}>{sub}</div>
      </div>
      <ArrowRight className={`w-4 h-4 mt-2 transition-transform group-hover:translate-x-0.5 ${accent ? 'text-white' : 'text-[var(--ink-300)] group-hover:text-[var(--ink-700)]'}`} />
    </button>
  );
}

function EmptyTasks({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="card p-10 text-center">
      <div className="w-10 h-10 mx-auto rounded-lg bg-[var(--ink-50)] flex items-center justify-center mb-3">
        <Receipt className="w-5 h-5 text-[var(--ink-400)]" strokeWidth={1.5} />
      </div>
      <div className="text-h4 mb-1">還沒有任何任務</div>
      <p className="text-meta mb-5 max-w-xs mx-auto">建立第一個任務，從 144 種 AI Agent 中挑選，體驗多 Agent 協作。</p>
      <button onClick={onCreate} className="btn btn-primary mx-auto">
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        建立第一個任務
      </button>
    </div>
  );
}