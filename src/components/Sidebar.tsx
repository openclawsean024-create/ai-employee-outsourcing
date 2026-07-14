'use client';
import { useAIEOStore } from '@/lib/store';
import {
  LayoutDashboard, Bot, Plus, Receipt, Bookmark, BarChart3, Settings as SettingsIcon, Sparkles
} from 'lucide-react';
import type { View } from '@/lib/types';
import { cn } from '@/lib/utils';

const MENU: Array<{ view: View; label: string; icon: React.ElementType }> = [
  { view: 'dashboard', label: '儀表板', icon: LayoutDashboard },
  { view: 'agents', label: 'AI Agent 庫', icon: Bot },
  { view: 'task_new', label: '建立任務', icon: Plus },
  { view: 'tasks', label: '任務歷史', icon: Receipt },
  { view: 'templates', label: '範本', icon: Bookmark },
  { view: 'usage', label: '用量', icon: BarChart3 },
  { view: 'settings', label: '設定', icon: SettingsIcon },
];

export default function Sidebar() {
  const currentView = useAIEOStore(s => s.currentView);
  const setView = useAIEOStore(s => s.setView);
  const settings = useAIEOStore(s => s.settings);
  const selectedCount = useAIEOStore(s => s.selectedAgentIds.length);

  return (
    <aside className="w-56 bg-slate-900 text-white flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm">AI Employee</div>
            <div className="text-xs text-slate-400">{settings.workspaceName}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-2">
        {MENU.map(item => {
          const Icon = item.icon;
          const active = currentView === item.view;
          return (
            <button key={item.view} onClick={() => setView(item.view)} className={cn('w-full px-4 py-2.5 flex items-center gap-3 text-sm transition-colors', active ? 'bg-indigo-600 text-white border-l-4 border-indigo-300' : 'text-slate-300 hover:bg-slate-800 border-l-4 border-transparent')}>
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.view === 'task_new' && selectedCount > 0 && (
                <span className="px-1.5 py-0.5 bg-indigo-500 rounded text-xs font-medium">{selectedCount}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-800 text-xs text-slate-500">
        <div>© 2026 OpenClaw</div>
        <div className="mt-1">v0.1 MVP · 144 Agents</div>
      </div>
    </aside>
  );
}
