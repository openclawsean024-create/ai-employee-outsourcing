'use client';

import { Check, Plus, Bot, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AGENT_CATEGORIES } from '@/lib/agents';
import type { AIAgent, AgentCategory } from '@/lib/types';

interface AgentCardProps {
  agent: AIAgent;
  selected: boolean;
  onToggle: () => void;
}

function AgentCard({ agent, selected, onToggle }: AgentCardProps) {
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
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--brand)] flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      )}

      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--brand-soft)] to-white border border-[var(--border-soft)] flex items-center justify-center mb-4">
        <Bot className="w-5 h-5 text-[var(--brand)]" strokeWidth={1.75} />
      </div>

      <div className="text-micro mb-2">{agent.categoryLabel}</div>

      <div className="text-h4 mb-2">{agent.displayName}</div>

      <p className="text-body-sm mb-4 line-clamp-2 min-h-[2.5em]">
        {agent.description}
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-soft)]">
        <span className="badge badge-neutral">{agent.modelType === 'gpt-4o' ? 'GPT-4o' : 'Claude 3.5'}</span>
        <span className="badge badge-success">{evalPct}% 評測</span>
        <span className="ml-auto text-body-sm text-tabular text-[var(--navy-700)]">${cost}/task</span>
      </div>

      {!selected && (
        <div className="mt-3 flex items-center text-body-sm text-[var(--brand)] font-medium">
          <Plus className="w-3.5 h-3.5 mr-1" />
          加入任務
        </div>
      )}
    </button>
  );
}

interface GridProps {
  filteredAgents: AIAgent[];
  activeCategory: AgentCategory | 'all';
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export default function AgentGrid({ filteredAgents, activeCategory, selectedIds, onToggle }: GridProps) {
  const categoryLabel = activeCategory !== 'all'
    ? AGENT_CATEGORIES.find(c => c.key === activeCategory)?.label
    : undefined;

  return (
    <section>
      <div className="text-meta mb-4">
        顯示 {filteredAgents.length} 個 Agent
        {categoryLabel && ` · ${categoryLabel}`}
      </div>
      {filteredAgents.length === 0 ? (
        <div className="card p-12 text-center">
          <Search className="w-8 h-8 mx-auto mb-3 text-[var(--navy-300)]" />
          <div className="text-h4 mb-2">沒有符合的 Agent</div>
          <p className="text-body-sm">換個關鍵字試試，或瀏覽全部類別</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              selected={selectedIds.includes(agent.id)}
              onToggle={() => onToggle(agent.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
