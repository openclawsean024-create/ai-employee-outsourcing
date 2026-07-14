'use client';

import { Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentCategory } from '@/lib/types';
import { ALL_AGENTS, AGENT_CATEGORIES } from '@/lib/agents';
import { countAgentsByCategory } from '@/lib/agents-catalog';
import type { View } from '@/lib/types';

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}

function FilterPill({ active, onClick, label, count }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 h-8 px-3 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap",
        active
          ? "bg-[var(--ink-900)] text-white"
          : "bg-white text-[var(--ink-700)] border border-[var(--border)] hover:border-[var(--ink-300)]"
      )}
    >
      {label}
      <span className={cn(
        "text-[11px] tabular-nums",
        active ? "text-[var(--ink-300)]" : "text-[var(--ink-400)]"
      )}>
        {count}
      </span>
    </button>
  );
}

interface Props {
  search: string;
  setSearch: (v: string) => void;
  activeCategory: AgentCategory | 'all';
  setActiveCategory: (v: AgentCategory | 'all') => void;
  selectedCount: number;
  setView: (v: View) => void;
}

export default function AgentsFiltersBar({
  search, setSearch, activeCategory, setActiveCategory, selectedCount, setView,
}: Props) {
  return (
    <section className="sticky top-0 bg-white/95 backdrop-blur-md -mx-6 md:-mx-10 px-6 md:px-10 py-3 border-b border-[var(--border-soft)] z-10">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-400)]" />
          <input
            type="text"
            placeholder="搜尋 Agent (例如：客服、IG、Excel)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
          <FilterPill
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            label="全部"
            count={ALL_AGENTS.length}
          />
          {AGENT_CATEGORIES.map(cat => (
            <FilterPill
              key={cat.key}
              active={activeCategory === cat.key}
              onClick={() => setActiveCategory(cat.key)}
              label={cat.label}
              count={countAgentsByCategory(cat.key)}
            />
          ))}
        </div>
      </div>
      {selectedCount > 0 && (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-body-sm">已選 <strong className="text-[var(--brand)]">{selectedCount}</strong> 個 Agent</span>
          <button onClick={() => setView('task_new')} className="btn btn-primary btn-sm">
            建立任務 ({selectedCount})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}
