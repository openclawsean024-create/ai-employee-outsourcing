'use client';

import { Bot, X } from 'lucide-react';
import type { AIAgent } from '@/lib/types';

interface Props {
  selectedAgents: AIAgent[];
  running: boolean;
  onToggle: (id: string) => void;
  onShowAll: () => void;
}

export default function SelectedAgentsPanel({ selectedAgents, running, onToggle, onShowAll }: Props) {
  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div className="text-micro">已選 Agent</div>
        <span className="text-h3 text-tabular">{selectedAgents.length}</span>
      </div>
      {selectedAgents.length === 0 ? (
        <div className="text-center py-6">
          <Bot className="w-8 h-8 mx-auto mb-2 text-[var(--navy-300)]" />
          <div className="text-body-sm text-[var(--navy-500)] mb-3">尚未選任何 Agent</div>
          <button onClick={onShowAll} className="btn btn-secondary btn-sm">
            挑選 Agent
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-3 max-h-72 overflow-y-auto">
            {selectedAgents.map(a => (
              <div key={a.id} className="flex items-center gap-2 py-1.5">
                <div className="w-7 h-7 rounded-md bg-[var(--brand-soft)] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[var(--brand)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body-sm font-medium truncate">{a.displayName}</div>
                </div>
                <button
                  onClick={() => onToggle(a.id)}
                  className="text-[var(--navy-400)] hover:text-[var(--navy-700)]"
                  disabled={running}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={onShowAll} className="btn btn-secondary btn-sm w-full">
            從 Agent 庫新增
          </button>
        </>
      )}
    </div>
  );
}
