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
import { cn } from '@/lib/utils';

export default function HomePage() {
  const currentView = useAIEOStore(s => s.currentView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--ink-0)]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex sticky top-0 h-screen">
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

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar />
    </div>
  );
}