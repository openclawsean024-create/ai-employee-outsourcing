'use client';

import { useAIEOStore } from '@/lib/store';
import {
  LayoutDashboard, Bot, Plus, Receipt, Bookmark, BarChart3, Settings as SettingsIcon, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import type { View } from '@/lib/types';
import { cn } from '@/lib/utils';

const MENU: Array<{ view: View; label: string; icon: React.ElementType }> = [
  { view: 'dashboard', label: '儀表板', icon: LayoutDashboard },
  { view: 'agents', label: 'Agent 庫', icon: Bot },
  { view: 'task_new', label: '建立任務', icon: Plus },
  { view: 'tasks', label: '任務歷史', icon: Receipt },
  { view: 'templates', label: '範本', icon: Bookmark },
  { view: 'usage', label: '用量', icon: BarChart3 },
  { view: 'settings', label: '設定', icon: SettingsIcon },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: Props) {
  const currentView = useAIEOStore(s => s.currentView);
  const setView = useAIEOStore(s => s.setView);
  const settings = useAIEOStore(s => s.settings);

  return (
    <aside
      className={cn(
        "flex flex-col bg-white border-r border-[var(--ink-100)]",
        "transition-[width] duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "h-14 flex items-center border-b border-[var(--ink-100)]",
        collapsed ? "justify-center px-2" : "px-4"
      )}>
        <div className="w-7 h-7 rounded-md bg-[var(--ink-900)] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="ml-2.5 min-w-0">
            <div className="text-[13px] font-semibold text-[var(--ink-900)] leading-tight">AI Employee</div>
            <div className="text-[11px] text-[var(--ink-500)] leading-tight truncate">{settings.workspaceName}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {MENU.map(item => {
          const Icon = item.icon;
          const active = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={cn(
                "w-full flex items-center gap-2.5 rounded-md text-[13px] font-medium",
                "transition-colors duration-150",
                collapsed ? "h-9 justify-center" : "h-8 px-2.5",
                active
                  ? "bg-[var(--ink-50)] text-[var(--ink-900)]"
                  : "text-[var(--ink-600)] hover:bg-[var(--ink-25)] hover:text-[var(--ink-900)]"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && active && <span className="ml-auto w-1 h-1 rounded-full bg-[var(--accent)]" />}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="h-10 flex items-center justify-center border-t border-[var(--ink-100)] text-[var(--ink-500)] hover:text-[var(--ink-700)] hover:bg-[var(--ink-25)] transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}