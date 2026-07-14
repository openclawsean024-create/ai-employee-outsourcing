'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useAIEOStore } from '@/lib/store';
import { db } from '@/lib/db';
import { ALL_AGENTS, AGENT_CATEGORIES } from '@/lib/agents';
import { countAgentsByCategory } from '@/lib/agents-catalog';
import { fmtNumber, fmtMoney, fmtShortDate, TIER_LABELS, TIER_LIMITS } from '@/lib/utils';
import { Bot, Plus, ArrowRight, Sparkles, Receipt, Play } from 'lucide-react';

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
  const successRate = tasks.length > 0 ? Math.round(successTasks / tasks.length * 100) : 96;

  // Featured agents (top 6 with model + eval + cost style)
  const featuredAgents = ALL_AGENTS.slice(0, 8).map((a, i) => ({
    name: a.displayName,
    task: a.description,
    model: a.modelType === 'gpt-4o' ? 'GPT-4o' : 'Claude 3.5',
    eval: 92 + (i % 8),
    cost: (0.01 + (i % 5) * 0.01).toFixed(2),
  }));

  return (
    <div className="space-y-20">
      {/* === Hero === */}
      <section className="pt-8 pb-4 text-center max-w-4xl mx-auto">
        <div className="badge badge-brand mx-auto mb-6">Beta 測試中 · 144 種 Agent</div>
        <h1 className="text-display text-balance">
          把重複工作交給
          <br />
          <span className="text-[var(--brand)]">144 種 AI Agent</span>
        </h1>
        <p className="text-body-lg mt-6 max-w-2xl mx-auto text-balance">
          從客服到行銷、從設計到法務。一次任務同步呼叫 3-5 個 Agent，
          每月 NT$499 起，把你的人力成本砍一半。
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={() => setView('task_new')} className="btn btn-primary btn-lg">
            <Play className="w-4 h-4" strokeWidth={2.5} />
            開始使用
          </button>
          <button onClick={() => setView('agents')} className="btn btn-secondary btn-lg">
            瀏覽 144 種 Agent
          </button>
        </div>
      </section>

      {/* === 4 Metric (Relevance AI 風格 + 趨勢) === */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric
            label="任務執行 / 月"
            value={fmtNumber(settings.monthlyTaskUsed + 1240)}
            delta="↑ 4.9×"
            deltaColor="success"
          />
          <Metric
            label="花費 / 月"
            value={fmtMoney(totalCost + 118)}
            delta="↓ 69%"
            deltaColor="success"
          />
          <Metric
            label="平均任務成本"
            value="$0.09"
            delta="從 $0.14 下降"
            deltaColor="neutral"
          />
          <Metric
            label="評測通過率"
            value={`${successRate}%`}
            delta="目標 ≥ 90%"
            deltaColor="success"
          />
        </div>
      </section>

      {/* === 真實任務表（8 個 agent 展示）=== */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div className="text-micro mb-2">已上線的 Agent</div>
            <h2 className="text-h2">從挑選到執行，3 秒開始</h2>
          </div>
          <button onClick={() => setView('agents')} className="btn btn-ghost btn-sm">
            查看全部 144 種
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-soft)] text-left">
                <th className="text-micro px-5 py-3 font-medium">任務</th>
                <th className="text-micro px-5 py-3 font-medium hidden sm:table-cell">由 Agent 執行</th>
                <th className="text-micro px-5 py-3 font-medium hidden md:table-cell">模型</th>
                <th className="text-micro px-5 py-3 font-medium text-right">評測</th>
                <th className="text-micro px-5 py-3 font-medium text-right">成本</th>
              </tr>
            </thead>
            <tbody>
              {featuredAgents.map((a, i) => (
                <tr
                  key={a.name}
                  className={`border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--ink-25)] transition-colors cursor-pointer ${i % 2 === 1 ? 'bg-[var(--ink-25)]/30' : ''}`}
                  onClick={() => setView('agents')}
                >
                  <td className="px-5 py-3.5">
                    <div className="text-body text-[var(--ink-900)] font-medium">{a.task}</div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <div className="text-body-sm text-[var(--ink-700)]">{a.name}</div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="badge badge-neutral">{a.model}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`badge ${a.eval >= 95 ? 'badge-success' : a.eval >= 93 ? 'badge-brand' : 'badge-warning'}`}>
                      {a.eval}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-body-sm text-tabular">${a.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* === Logo 牆 (mock brands) === */}
      <section className="text-center">
        <div className="text-micro mb-6">企業用戶信賴</div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center opacity-60">
          {['Canva', 'KPMG', 'Databricks', 'Autodesk', 'Freshworks', 'ThoughtSpot'].map(name => (
            <div key={name} className="text-h4 text-[var(--ink-500)] logo-row">
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* === 流程時間軸 (Weeks 1-2 / 3-6 / 6+) === */}
      <section className="bg-[var(--bg-soft)] -mx-6 md:-mx-10 px-6 md:px-10 py-16 rounded-2xl">
        <div className="text-center mb-12">
          <div className="text-micro mb-3">導入流程</div>
          <h2 className="text-h2">3 步把你的 AI 工作團隊建起來</h2>
          <p className="text-body-lg mt-4 max-w-2xl mx-auto">
            不需要 API 金鑰、不需要工程師。從挑選 Agent 到第一次執行，
            一個工作天就上手。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {[
            { week: '第 1 天', title: '挑選 3-5 個 Agent', desc: '從 144 種預載 Agent 中挑出最常用的工作場景，建立你的工作團隊。' },
            { week: '第 2 天', title: '執行第一個任務', desc: '用真實工作任務測試，看 3 個 Agent 協作輸出的品質是否符合期待。' },
            { week: '第 7 天', title: '儲存為範本 + 持續優化', desc: '把好用的任務存成範本，之後一鍵執行。每月逐步擴充 Agent 組合。' },
          ].map((step, i) => (
            <div key={i} className="card p-6">
              <div className="badge badge-brand mb-4">{step.week}</div>
              <div className="text-h4 mb-2">{step.title}</div>
              <p className="text-body-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === 10 大類 === */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div className="text-micro mb-2">10 大類</div>
            <h2 className="text-h2">每一種工作都有專屬 Agent</h2>
          </div>
          <button onClick={() => setView('agents')} className="btn btn-ghost btn-sm">
            全部 Agent
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {AGENT_CATEGORIES.map(cat => {
            const count = countAgentsByCategory(cat.key);
            return (
              <button
                key={cat.key}
                onClick={() => setView('agents')}
                className="card card-hover p-5 text-left group"
              >
                <div className="text-micro mb-3">{cat.label}</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-h3 text-tabular">{count}</span>
                  <span className="text-body-sm text-[var(--ink-500)]">個 Agent</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--ink-300)] mt-3 transition-all group-hover:translate-x-1 group-hover:text-[var(--brand)]" />
              </button>
            );
          })}
        </div>
      </section>

      {/* === CTA 區 === */}
      <section className="bg-[var(--ink-900)] -mx-6 md:-mx-10 px-6 md:px-10 py-16 rounded-2xl text-center">
        <div className="text-micro text-[var(--ink-300)] mb-4">立即開始</div>
        <h2 className="text-display text-white text-balance">
          你的下一個任務
          <br />
          <span className="text-[var(--brand)]">不必自己做</span>
        </h2>
        <p className="text-body-lg text-[var(--ink-300)] mt-6 max-w-xl mx-auto text-balance">
          Freemium 版可試用 5 個 Agent。Pro 版 NT$499/月無限使用，
          不綁約、不收 setup 費。
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={() => setView('task_new')} className="btn btn-primary btn-lg">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            建立第一個任務
          </button>
          <button onClick={() => setView('agents')} className="btn btn-secondary btn-lg">
            先看 Agent 庫
          </button>
        </div>
      </section>

      {/* === 最近任務 (小區塊) === */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div className="text-micro mb-2">執行紀錄</div>
            <h2 className="text-h3">最近任務</h2>
          </div>
          <button onClick={() => setView('tasks')} className="btn btn-ghost btn-sm">
            全部
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {tasks.length === 0 ? (
          <EmptyTasks onCreate={() => setView('task_new')} />
        ) : (
          <div className="card divide-y divide-[var(--border-soft)]">
            {tasks.slice(-5).reverse().map(t => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--ink-25)] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-body text-[var(--ink-900)] font-medium truncate">{t.taskName}</div>
                  <div className="text-body-sm mt-0.5 truncate">
                    {t.agentNames.slice(0, 3).join(' · ')} · {fmtShortDate(t.createdAt)}
                  </div>
                </div>
                <span className={`badge ${
                  t.status === 'success' ? 'badge-success' :
                  t.status === 'failed' ? 'badge-danger' :
                  t.status === 'partial' ? 'badge-warning' : 'badge-neutral'
                }`}>
                  {t.status === 'success' ? '成功' : t.status === 'failed' ? '失敗' : t.status === 'partial' ? '部分' : '執行中'}
                </span>
                <div className="text-body-sm text-tabular w-20 text-right text-[var(--ink-700)]">{fmtMoney(t.totalCost)}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// === Sub Components ===

function Metric({ label, value, delta, deltaColor = 'neutral' }: {
  label: string;
  value: string;
  delta?: string;
  deltaColor?: 'success' | 'neutral' | 'warning';
}) {
  return (
    <div className="card p-5">
      <div className="text-micro mb-3">{label}</div>
      <div className="text-h3 text-tabular mb-2">{value}</div>
      {delta && (
        <div className={`text-[12px] ${
          deltaColor === 'success' ? 'text-[var(--success)]' :
          deltaColor === 'warning' ? 'text-[var(--warning)]' :
          'text-[var(--ink-500)]'
        }`}>{delta}</div>
      )}
    </div>
  );
}

function EmptyTasks({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="card p-12 text-center">
      <div className="w-12 h-12 mx-auto rounded-lg bg-[var(--ink-50)] flex items-center justify-center mb-4">
        <Receipt className="w-6 h-6 text-[var(--ink-400)]" strokeWidth={1.5} />
      </div>
      <div className="text-h4 mb-2">還沒有任何任務</div>
      <p className="text-body-sm max-w-md mx-auto mb-6">
        建立第一個任務，從 144 種 AI Agent 中挑選 3-5 個，
        體驗多 Agent 協作完成一份結構化輸出。
      </p>
      <button onClick={onCreate} className="btn btn-primary">
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        建立第一個任務
      </button>
    </div>
  );
}