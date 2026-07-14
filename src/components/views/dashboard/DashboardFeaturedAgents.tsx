'use client';

import { ArrowRight } from 'lucide-react';
import { ALL_AGENTS } from '@/lib/agents';
import type { View } from '@/lib/types';

// Featured agents 邏輯：取前 8 個 + 決定性展示資料（評測/成本用 index 推算，避免 random）
const featuredAgents = ALL_AGENTS.slice(0, 8).map((a, i) => ({
  name: a.displayName,
  task: a.description,
  model: a.modelType === 'gpt-4o' ? 'GPT-4o' : 'Claude 3.5',
  eval: 92 + (i % 8),
  cost: (0.01 + (i % 5) * 0.01).toFixed(2),
}));

export default function DashboardFeaturedAgents({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="text-micro mb-2">已上線的 Agent</div>
          <h2 className="text-h2">從挑選到執行，3 秒開始</h2>
        </div>
        <button onClick={() => onNavigate('agents')} className="btn btn-ghost btn-sm">
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
                onClick={() => onNavigate('agents')}
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
  );
}
