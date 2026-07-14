'use client';

import { useAIEOStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import DashboardView from '@/components/views/DashboardView';
import AgentsView from '@/components/views/AgentsView';
import NewTaskView from '@/components/views/NewTaskView';
import TasksView from '@/components/views/TasksView';
import TemplatesView from '@/components/views/TemplatesView';
import UsageView from '@/components/views/UsageView';
import SettingsView from '@/components/views/SettingsView';

export default function HomePage() {
  const currentView = useAIEOStore(s => s.currentView);

  return (
    <div className="h-screen flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'agents' && <AgentsView />}
        {currentView === 'task_new' && <NewTaskView />}
        {currentView === 'tasks' && <TasksView />}
        {currentView === 'templates' && <TemplatesView />}
        {currentView === 'usage' && <UsageView />}
        {currentView === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}