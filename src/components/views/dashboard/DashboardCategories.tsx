'use client';

import {
  ArrowRight,
  Headphones,
  Megaphone,
  Palette,
  Briefcase,
  Database,
  TrendingUp,
  Users,
  Scale,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { AGENT_CATEGORIES } from '@/lib/agents';
import { countAgentsByCategory } from '@/lib/agents-catalog';
import type { View } from '@/lib/types';

const CATEGORY_ICON: Record<string, React.ElementType> = {
  customer_service: Headphones,
  marketing: Megaphone,
  design: Palette,
  secretary: Briefcase,
  data: Database,
  sales: TrendingUp,
  hr: Users,
  legal: Scale,
  finance: Wallet,
  specialist: Sparkles,
};

export default function DashboardCategories({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="eyebrow mb-2">10 大類</div>
          <h2 className="text-h2">每一種工作都有專屬 Agent</h2>
        </div>
        <button onClick={() => onNavigate('agents')} className="btn btn-ghost btn-sm hidden md:inline-flex">
          全部 Agent
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {AGENT_CATEGORIES.map(cat => {
          const count = countAgentsByCategory(cat.key);
          const Icon = CATEGORY_ICON[cat.key] || Sparkles;
          return (
            <button
              key={cat.key}
              onClick={() => onNavigate('agents')}
              className="card p-5 text-left group"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[var(--brand-soft)] flex items-center justify-center mb-3 transition-colors group-hover:bg-[var(--brand)]">
                <Icon className="w-5 h-5 text-[var(--brand)] transition-colors group-hover:text-white" strokeWidth={2} />
              </div>
              <div className="text-body-sm font-semibold text-[var(--navy-900)] mb-1">{cat.label}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-h4 text-tabular text-[var(--navy-900)]">{count}</span>
                <span className="text-[12px] text-[var(--navy-600)]">個 Agent</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}