'use client';

import { useState } from 'react';
import { useAIEOStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import MobileTabBar from '@/components/MobileTabBar';
import DashboardView from '@/components/views/DashboardView';
import AgentsView from '@/components/views/AgentsView';
import NewTaskView from '@/components/views/NewTaskView';
import TasksView from '@/components/views/TasksView';
import TemplatesView from '@/components/views/TemplatesView';
import UsageView from '@/components/views/UsageView';
import SettingsView from '@/components/views/SettingsView';
import OutcomeWorkbenchRoot from '@/components/views/outcome/OutcomeWorkbenchRoot';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const currentView = useAIEOStore(s => s.currentView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isOutcome = currentView === 'outcome';

  return (
    <div className="min-h-screen flex bg-[var(--cream-200)]">
      {/* Desktop Sidebar — v3 「成果工作台」採無側欄設計（與 prototype v2 一致） */}
      {!isOutcome && (
        <div className="hidden md:flex sticky top-0 h-screen">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className={cn(
            "mx-auto w-full",
            isOutcome ? "max-w-[1320px] px-0 py-0 md:px-0 md:py-0 pb-0 md:pb-0" : "max-w-[1200px] px-6 py-8 md:px-10 md:py-12 pb-24 md:pb-12",
          )}>
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'agents' && <AgentsView />}
            {currentView === 'task_new' && <NewTaskView />}
            {currentView === 'tasks' && <TasksView />}
            {currentView === 'templates' && <TemplatesView />}
            {currentView === 'usage' && <UsageView />}
            {currentView === 'settings' && <SettingsView />}
            {currentView === 'outcome' && <OutcomeWorkbenchRoot />}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Tab Bar — 同上，成果工作台手機改用自己的底部浮動列（見 OutcomeToMobile） */}
      {!isOutcome && <MobileTabBar />}
    </div>
  );
}