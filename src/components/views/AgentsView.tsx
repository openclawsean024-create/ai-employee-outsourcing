'use client';

import { useState, useMemo } from 'react';
import { useAIEOStore } from '@/lib/store';
import { ALL_AGENTS, AGENT_CATEGORIES, getCategoryAgents } from '@/lib/agents';
import { Search, Plus, Check, ArrowRight, Bot } from 'lucide-react';
import type { AgentCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function AgentsView() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<AgentCategory | 'all'>('all');
  const selectedIds = useAIEOStore(s => s.selectedAgentIds);
  const toggleSelect = useAIEOStore(s => s.toggleAgentSelection);
  const setView = useAIEOStore(s => s.setView);

  const filtered = useMemo(() => {
    let agents = ALL_AGENTS;
    if (activeCategory !== 'all') {
      agents = getCategoryAgents(activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      agents = agents.filter(a =>
        a.displayName.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
      );
    }
    return agents;
  }, [search, activeCategory]);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="pt-4">
        <div className="text-micro mb-3">Agent 庫</div>
        <h1 className="text-h1 text-balance">
          144 種預載 Agent，
          <br />
          <span className="text-[var(--brand)]">挑 3-5 個就開工</span>
        </h1>
        <p className="text-body-lg mt-5 max-w-2xl">
          從客服到行銷、從設計到法務。每一種都是企業可用的 specialists，
          不用微調 prompt，直接挑來用。
        </p>
      </section>

      {/* Search + Filters */}
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
                count={ALL_AGENTS.filter(a => a.category === cat.key).length}
              />
            ))}
          </div>
        </div>
        {selectedIds.length > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-body-sm">已選 <strong className="text-[var(--brand)]">{selectedIds.length}</strong> 個 Agent</span>
            <button onClick={() => setView('task_new')} className="btn btn-primary btn-sm">
              建立任務 ({selectedIds.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* Agent Grid */}
      <section>
        <div className="text-meta mb-4">
          顯示 {filtered.length} 個 Agent
          {activeCategory !== 'all' && ` · ${AGENT_CATEGORIES.find(c => c.key === activeCategory)?.label}`}
        </div>
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Search className="w-8 h-8 mx-auto mb-3 text-[var(--ink-300)]" />
            <div className="text-h4 mb-2">沒有符合的 Agent</div>
            <p className="text-body-sm">換個關鍵字試試，或瀏覽全部類別</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                selected={selectedIds.includes(agent.id)}
                onToggle={() => toggleSelect(agent.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FilterPill({ active, onClick, label, count }: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
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

function AgentCard({ agent, selected, onToggle }: {
  agent: typeof ALL_AGENTS[number];
  selected: boolean;
  onToggle: () => void;
}) {
  const evalPct = 90 + (agent.id.charCodeAt(1) % 8);
  const cost = (0.01 + (agent.id.charCodeAt(2) % 9) * 0.01).toFixed(2);

  return (
    <button
      onClick={onToggle}
      className={cn(
        "card card-hover p-5 text-left transition-all relative",
        selected && "ring-2 ring-[var(--brand)] border-[var(--brand)]"
      )}
    >
      {/* Selected check */}
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--brand)] flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      )}

      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--brand-soft)] to-white border border-[var(--border-soft)] flex items-center justify-center mb-4">
        <Bot className="w-5 h-5 text-[var(--brand)]" strokeWidth={1.75} />
      </div>

      {/* Category badge */}
      <div className="text-micro mb-2">{agent.categoryLabel}</div>

      {/* Title */}
      <div className="text-h4 mb-2">{agent.displayName}</div>

      {/* Description */}
      <p className="text-body-sm mb-4 line-clamp-2 min-h-[2.5em]">
        {agent.description}
      </p>

      {/* Spec row */}
      <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-soft)]">
        <span className="badge badge-neutral">{agent.modelType === 'gpt-4o' ? 'GPT-4o' : 'Claude 3.5'}</span>
        <span className="badge badge-success">{evalPct}% 評測</span>
        <span className="ml-auto text-body-sm text-tabular text-[var(--ink-700)]">${cost}/task</span>
      </div>

      {/* Add button */}
      {!selected && (
        <div className="mt-3 flex items-center text-body-sm text-[var(--brand)] font-medium">
          <Plus className="w-3.5 h-3.5 mr-1" />
          加入任務
        </div>
      )}
    </button>
  );
}