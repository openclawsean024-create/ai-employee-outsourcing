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
import DemoNotice from '@/components/demo/DemoNotice';
import { cn } from '@/lib/utils';

/**
 * 144 Agent mock 工作台（原首頁，M1 AC-009 移到 /demo）。
 * 所有輸出來自 src/lib/orchestrator.ts 的固定文案，沒有呼叫任何 AI 服務。
 */
export default function DemoWorkbench() {
  const currentView = useAIEOStore(s => s.currentView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[var(--cream-200)]">
      <DemoNotice />

      <div className="flex-1 min-h-0 flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex h-full">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className={cn(
              "mx-auto w-full",
              "max-w-[1200px]",
              "px-6 py-8 md:px-10 md:py-12",
              "pb-24 md:pb-12"  // mobile: leave room for bottom tab bar
            )}>
              {currentView === 'dashboard' && <DashboardView />}
              {currentView === 'agents' && <AgentsView />}
              {currentView === 'task_new' && <NewTaskView />}
              {currentView === 'tasks' && <TasksView />}
              {currentView === 'templates' && <TemplatesView />}
              {currentView === 'usage' && <UsageView />}
              {currentView === 'settings' && <SettingsView />}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar />
    </div>
  );
}
