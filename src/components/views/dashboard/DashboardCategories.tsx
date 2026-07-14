'use client';

import { ArrowRight } from 'lucide-react';
import { AGENT_CATEGORIES } from '@/lib/agents';
import { countAgentsByCategory } from '@/lib/agents-catalog';
import type { View } from '@/lib/types';

export default function DashboardCategories({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="text-micro mb-2">10 大類</div>
          <h2 className="text-h2">每一種工作都有專屬 Agent</h2>
        </div>
        <button onClick={() => onNavigate('agents')} className="btn btn-ghost btn-sm">
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
              onClick={() => onNavigate('agents')}
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
  );
}
