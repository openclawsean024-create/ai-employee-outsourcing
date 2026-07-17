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
        "flex flex-col bg-white border-r border-[var(--border)]",
        "transition-[width] duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className={cn(
        "h-16 flex items-center border-b border-[var(--border-soft)]",
        collapsed ? "justify-center px-2" : "px-4"
      )}>
        <div className="w-8 h-8 rounded-md bg-[var(--brand)] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="ml-2.5 min-w-0">
            <div className="text-[14px] font-semibold text-[var(--navy-900)] leading-tight font-display">AI Employee</div>
            <div className="text-[12px] text-[var(--navy-500)] leading-tight truncate">{settings.workspaceName}</div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {MENU.map(item => {
          const Icon = item.icon;
          const active = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={cn(
                "w-full flex items-center gap-2.5 rounded-md text-[14px] font-medium",
                "transition-colors duration-150",
                collapsed ? "h-9 justify-center" : "h-9 px-2.5",
                active
                  ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                  : "text-[var(--navy-700)] hover:bg-[var(--navy-50)] hover:text-[var(--navy-900)]"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.75} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onToggle}
        className="h-10 flex items-center justify-center border-t border-[var(--border-soft)] text-[var(--navy-400)] hover:text-[var(--navy-700)] hover:bg-[var(--cream-50)] transition-colors"
        aria-label={collapsed ? '展開側邊欄' : '收合側邊欄'}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}