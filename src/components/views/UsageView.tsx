'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { ALL_AGENTS, AGENT_CATEGORIES } from '@/lib/agents';
import { fmtMoney, fmtNumber, TIER_LABELS, TIER_LIMITS } from '@/lib/utils';
import { useAIEOStore } from '@/lib/store';
import { TrendingUp, Clock, DollarSign, CheckCircle2 } from 'lucide-react';

export default function UsageView() {
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const settings = useAIEOStore(s => s.settings);
  const tierLimit = TIER_LIMITS[settings.tier];

  const totalCost = tasks.reduce((s, t) => s + t.totalCost, 0);
  const successCount = tasks.filter(t => t.status === 'success').length;
  const totalDurationMs = tasks.reduce((s, t) => s + t.totalDurationMs, 0);
  const savedHours = totalDurationMs / 3600000 * 8; // 假設 AI 幫忙省 8x 時間

  // Agent 使用次數
  const agentUsage = new Map<string, number>();
  for (const t of tasks) {
    for (const n of t.agentNames) {
      agentUsage.set(n, (agentUsage.get(n) || 0) + 1);
    }
  }
  const topAgents = Array.from(agentUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxAgentUse = topAgents[0]?.[1] || 1;

  // 類別使用
  const categoryUsage = new Map<string, number>();
  for (const t of tasks) {
    const agents = ALL_AGENTS.filter(a => t.agentIds.includes(a.id));
    for (const a of agents) {
      categoryUsage.set(a.categoryLabel, (categoryUsage.get(a.categoryLabel) || 0) + 1);
    }
  }
  const topCategories = Array.from(categoryUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // 每日任務（最近 7 天）
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });
  const dailyTasks = last7Days.map(date => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const count = tasks.filter(t => {
      const td = new Date(t.createdAt);
      return td >= dayStart && td <= dayEnd;
    }).length;
    return { date, count, label: `${date.getMonth() + 1}/${date.getDate()}` };
  });
  const maxDaily = Math.max(...dailyTasks.map(d => d.count), 1);

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <div className="text-micro mb-3">用量報表</div>
        <h1 className="text-h1 text-balance">
          你的 AI 團隊
          <br />
          <span className="text-[var(--brand)]">這週幫你省了 {savedHours.toFixed(1)} 小時</span>
        </h1>
      </section>

      {/* 4 指標 */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BigMetric
            icon={TrendingUp}
            label="總任務數"
            value={fmtNumber(tasks.length)}
            sub={`本月 ${settings.monthlyTaskUsed} / ${tierLimit.taskLimit}`}
          />
          <BigMetric
            icon={CheckCircle2}
            label="成功率"
            value={tasks.length > 0 ? `${Math.round(successCount / tasks.length * 100)}%` : '—'}
            sub={`${successCount} / ${tasks.length}`}
          />
          <BigMetric
            icon={Clock}
            label="節省時間"
            value={`${savedHours.toFixed(1)}h`}
            sub="vs 人工估算"
          />
          <BigMetric
            icon={DollarSign}
            label="累計成本"
            value={fmtMoney(totalCost)}
            sub={`平均 NT$${tasks.length > 0 ? (totalCost / tasks.length).toFixed(2) : '0.00'} / 任務`}
          />
        </div>
      </section>

      {/* 每日任務圖 */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div className="text-micro mb-2">近 7 天</div>
            <h2 className="text-h3">每日任務量</h2>
          </div>
        </div>
        <div className="card p-6">
          {tasks.length === 0 ? (
            <div className="text-center text-body-sm text-[var(--ink-500)] py-8">
              開始建立任務後，這裡會顯示每日使用趨勢
            </div>
          ) : (
            <div className="flex items-end justify-between gap-2 h-40">
              {dailyTasks.map((d, i) => {
                const heightPct = (d.count / maxDaily) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-body-sm text-tabular font-medium text-[var(--ink-700)]">{d.count}</div>
                    <div className="w-full bg-[var(--ink-50)] rounded-md overflow-hidden" style={{ height: 100 }}>
                      <div
                        className="w-full bg-[var(--brand)] transition-all duration-500 mt-auto"
                        style={{ height: `${heightPct}%`, marginTop: `${100 - heightPct}%` }}
                      />
                    </div>
                    <div className="text-body-sm text-[var(--ink-500)]">{d.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Agents */}
        <section>
          <div className="mb-4">
            <div className="text-micro mb-2">最常用 Agent</div>
            <h2 className="text-h3">Top 5</h2>
          </div>
          <div className="card p-5">
            {topAgents.length === 0 ? (
              <div className="text-center text-body-sm text-[var(--ink-500)] py-6">尚無資料</div>
            ) : (
              <div className="space-y-3">
                {topAgents.map(([name, count], i) => (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-body font-medium">{name}</div>
                      <div className="text-body-sm text-tabular text-[var(--ink-700)]">{count} 次</div>
                    </div>
                    <div className="h-1.5 bg-[var(--ink-50)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--brand)] transition-all"
                        style={{ width: `${(count / maxAgentUse) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Category Distribution */}
        <section>
          <div className="mb-4">
            <div className="text-micro mb-2">類別分布</div>
            <h2 className="text-h3">10 大類</h2>
          </div>
          <div className="card p-5">
            <div className="space-y-2.5">
              {topCategories.map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="text-body">{cat}</div>
                  <div className="text-body-sm text-tabular text-[var(--ink-700)]">{count} 次</div>
                </div>
              ))}
              {topCategories.length === 0 && (
                <div className="text-center text-body-sm text-[var(--ink-500)] py-6">尚無資料</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function BigMetric({ icon: Icon, label, value, sub }: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-micro">{label}</div>
        <Icon className="w-4 h-4 text-[var(--brand)]" strokeWidth={1.75} />
      </div>
      <div className="text-h2 text-tabular mb-1">{value}</div>
      {sub && <div className="text-body-sm text-[var(--ink-500)]">{sub}</div>}
    </div>
  );
}