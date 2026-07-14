'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { ALL_AGENTS } from '@/lib/agents';
import { useAIEOStore } from '@/lib/store';
import {
  UsageHeader,
  UsageMetrics,
  DailyTasksChart,
  TopAgentsList,
  CategoryDistribution,
} from './usage';

export default function UsageView() {
  const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
  const settings = useAIEOStore(s => s.settings);

  // Derived metrics
  const totalDurationMs = tasks.reduce((s, t) => s + t.totalDurationMs, 0);
  const savedHours = (totalDurationMs / 3600000) * 8;

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
      <UsageHeader savedHours={savedHours} />
      <UsageMetrics tasks={tasks} settings={settings} />
      <DailyTasksChart dailyTasks={dailyTasks} maxDaily={maxDaily} hasTasks={tasks.length > 0} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopAgentsList topAgents={topAgents} maxAgentUse={maxAgentUse} />
        <CategoryDistribution topCategories={topCategories} />
      </div>
    </div>
  );
}
