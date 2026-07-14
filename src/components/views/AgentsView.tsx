'use client';
import { useState, useMemo } from 'react';
import { useAIEOStore } from '@/lib/store';
import { ALL_AGENTS, AGENT_CATEGORIES } from '@/lib/agents';
import type { AgentCategory } from '@/lib/types';
import { Search, Plus, Check, Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgentsView() {
  const [category, setCategory] = useState<AgentCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const selectedAgentIds = useAIEOStore(s => s.selectedAgentIds);
  const toggleAgentSelection = useAIEOStore(s => s.toggleAgentSelection);
  const setView = useAIEOStore(s => s.setView);
  const clearAgentSelection = useAIEOStore(s => s.clearAgentSelection);

  const filtered = useMemo(() => {
    return ALL_AGENTS.filter(a => {
      if (category !== 'all' && a.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!a.displayName.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q) && !a.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [category, search]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-600" />
            AI Agent 庫
          </h2>
          <p className="text-sm text-slate-500 mt-1">{ALL_AGENTS.length} 種預載 Agent · {AGENT_CATEGORIES.length} 大類 · 多 Agent 協作</p>
        </div>
        {selectedAgentIds.length > 0 && (
          <div className="flex gap-2">
            <button onClick={clearAgentSelection} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">清除選擇</button>
            <button onClick={() => setView('task_new')} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              建立任務 ({selectedAgentIds.length})
            </button>
          </div>
        )}
      </div>

      {/* 搜尋 + 分類 */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜尋 Agent 名稱或描述..." className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
      </div>

      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setCategory('all')} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap', category === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>全部 ({ALL_AGENTS.length})</button>
        {AGENT_CATEGORIES.map(cat => {
          const count = ALL_AGENTS.filter(a => a.category === cat.key).length;
          return (
            <button key={cat.key} onClick={() => setCategory(cat.key)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap', category === cat.key ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Agent 卡片網格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map(agent => {
          const isSelected = selectedAgentIds.includes(agent.id);
          return (
            <button key={agent.id} onClick={() => toggleAgentSelection(agent.id)} className={cn('text-left bg-white border-2 rounded-lg p-3 transition-all hover:shadow-md', isSelected ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300')}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-900 truncate">{agent.displayName}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{agent.name}</div>
                </div>
                <div className={cn('w-6 h-6 rounded flex items-center justify-center flex-shrink-0', isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400')}>
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </div>
              <div className="text-xs text-slate-600 mb-2 line-clamp-2 min-h-[2rem]">{agent.description}</div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">{agent.categoryLabel}</span>
                <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">{agent.modelType}</span>
              </div>
            </button>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center text-slate-400 py-12">沒有符合條件的 Agent</div>
      )}
    </div>
  );
}
