'use client';

import { ArrowLeft } from 'lucide-react';
import { ALL_AGENTS } from '@/lib/agents';
import { cn } from '@/lib/utils';

interface Props {
  selectedIds: string[];
  onBack: () => void;
  onToggle: (id: string) => void;
}

export default function AgentPickerFullView({ selectedIds, onBack, onToggle }: Props) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="btn btn-ghost btn-sm">
        <ArrowLeft className="w-4 h-4" />
        返回任務建立
      </button>
      <h2 className="text-h2">新增 Agent 到任務</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ALL_AGENTS.map(agent => {
          const selected = selectedIds.includes(agent.id);
          return (
            <button
              key={agent.id}
              onClick={() => onToggle(agent.id)}
              className={cn(
                "card p-4 text-left transition-all",
                selected && "ring-2 ring-[var(--brand)] border-[var(--brand)]"
              )}
            >
              <div className="text-micro mb-2">{agent.categoryLabel}</div>
              <div className="text-h4 mb-1">{agent.displayName}</div>
              <p className="text-body-sm line-clamp-2">{agent.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
