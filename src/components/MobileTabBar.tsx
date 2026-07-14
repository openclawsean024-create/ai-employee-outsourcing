'use client';

import { useAIEOStore } from '@/lib/store';
import { LayoutDashboard, Bot, Plus, Settings as SettingsIcon } from 'lucide-react';
import type { View } from '@/lib/types';
import { cn } from '@/lib/utils';

const MOBILE_MENU: Array<{ view: View; label: string; icon: React.ElementType }> = [
  { view: 'dashboard', label: '儀表板', icon: LayoutDashboard },
  { view: 'agents', label: 'Agent', icon: Bot },
  { view: 'task_new', label: '建立', icon: Plus },
  { view: 'settings', label: '設定', icon: SettingsIcon },
];

export default function MobileTabBar() {
  const currentView = useAIEOStore(s => s.currentView);
  const setView = useAIEOStore(s => s.setView);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[var(--ink-100)] z-50">
      <div className="flex items-stretch justify-around h-16">
        {MOBILE_MENU.map(item => {
          const Icon = item.icon;
          const active = currentView === item.view;
          // 「建立」用圓形凸起按鈕 (Linear-style FAB)
          if (item.view === 'task_new') {
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className="flex-1 flex items-center justify-center -mt-3"
                title={item.label}
              >
                <span className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center",
                  "bg-[var(--ink-900)] text-white",
                  "shadow-[var(--shadow-3)]",
                  "transition-transform active:scale-95"
                )}>
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </span>
              </button>
            );
          }
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-colors",
                active ? "text-[var(--ink-900)]" : "text-[var(--ink-500)]"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={1.75} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}