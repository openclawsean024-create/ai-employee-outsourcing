'use client';

import { useState, useMemo } from 'react';
import { useAIEOStore } from '@/lib/store';
import { ALL_AGENTS } from '@/lib/agents';
import { listAgentsByCategory } from '@/lib/agents-catalog';
import type { AgentCategory } from '@/lib/types';
import { AgentsHeader, AgentsFiltersBar, AgentGrid } from './agents';

export default function AgentsView() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<AgentCategory | 'all'>('all');
  const selectedIds = useAIEOStore(s => s.selectedAgentIds);
  const toggleSelect = useAIEOStore(s => s.toggleAgentSelection);
  const setView = useAIEOStore(s => s.setView);

  const filtered = useMemo(() => {
    let agents = ALL_AGENTS;
    if (activeCategory !== 'all') {
      agents = listAgentsByCategory(activeCategory);
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
      <AgentsHeader />
      <AgentsFiltersBar
        search={search}
        setSearch={setSearch}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        selectedCount={selectedIds.length}
        setView={setView}
      />
      <AgentGrid
        filteredAgents={filtered}
        activeCategory={activeCategory}
        selectedIds={selectedIds}
        onToggle={toggleSelect}
      />
    </div>
  );
}
