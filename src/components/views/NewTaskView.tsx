'use client';

import { useState } from 'react';
import { useAIEOStore } from '@/lib/store';
import { ALL_AGENTS } from '@/lib/agents';
import { runMultiAgentCollaboration } from '@/lib/orchestrator';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { fmtMoney } from '@/lib/utils';
import {
  TaskNewHeader,
  TaskInputPanel,
  SelectedAgentsPanel,
  CostLimitPanel,
  RecentTasksPanel,
  AgentPickerFullView,
} from './task-new';

export default function NewTaskView() {
  const selectedIds = useAIEOStore(s => s.selectedAgentIds);
  const toggleSelect = useAIEOStore(s => s.toggleAgentSelection);
  const setView = useAIEOStore(s => s.setView);
  const settings = useAIEOStore(s => s.settings);
  const updateSettings = useAIEOStore(s => s.updateSettings);
  const [taskName, setTaskName] = useState('');
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const [showAllAgents, setShowAllAgents] = useState(false);
  const [acknowledgeOverLimit, setAcknowledgeOverLimit] = useState(false);

  const selectedAgents = ALL_AGENTS.filter(a => selectedIds.includes(a.id));
  const estimatedCost = selectedAgents.length * 0.05;
  const overLimit = estimatedCost > settings.defaultCostLimit;
  const recentTasks = useLiveQuery(() =>
    db.tasks.orderBy('createdAt').reverse().limit(5).toArray()
  ) || [];

  async function handleRun() {
    if (!input.trim() || selectedAgents.length === 0) return;
    if (overLimit && !acknowledgeOverLimit) return;

    setRunning(true);
    try {
      const results = await runMultiAgentCollaboration(selectedAgents, input);
      const totalCost = results.reduce((s, r) => s + r.costNTD, 0);
      const totalDuration = results.reduce((s, r) => s + r.durationMs, 0);
      const allSuccess = results.every(r => r.status === 'success');
      const anyFailed = results.some(r => r.status === 'failed');

      await db.tasks.add({
        id: `t_${Date.now()}`,
        taskName: taskName || `任務 ${new Date().toLocaleString('zh-TW')}`,
        input,
        agentIds: selectedAgents.map(a => a.id),
        agentNames: selectedAgents.map(a => a.displayName),
        results,
        status: allSuccess ? 'success' : anyFailed && !allSuccess ? 'failed' : 'partial',
        totalCost,
        totalDurationMs: totalDuration,
        createdAt: new Date().toISOString(),
      });

      updateSettings({
        ...settings,
        monthlyTaskUsed: settings.monthlyTaskUsed + 1,
      });

      selectedIds.forEach(id => toggleSelect(id));
      setTaskName('');
      setInput('');
      setView('tasks');
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  }

  if (showAllAgents) {
    return (
      <AgentPickerFullView
        selectedIds={selectedIds}
        onBack={() => setShowAllAgents(false)}
        onToggle={toggleSelect}
      />
    );
  }

  return (
    <div className="space-y-8">
      <TaskNewHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskInputPanel
          taskName={taskName}
          setTaskName={setTaskName}
          input={input}
          setInput={setInput}
          running={running}
          selectedAgents={selectedAgents}
          estimatedCost={estimatedCost}
          overLimit={overLimit}
          acknowledgeOverLimit={acknowledgeOverLimit}
          setAcknowledgeOverLimit={setAcknowledgeOverLimit}
          onRun={handleRun}
          setView={setView}
          settings={settings}
        />

        <div className="space-y-4">
          <SelectedAgentsPanel
            selectedAgents={selectedAgents}
            running={running}
            onToggle={toggleSelect}
            onShowAll={() => setShowAllAgents(true)}
          />
          <CostLimitPanel
            settings={settings}
            onChange={(v) => updateSettings({ ...settings, defaultCostLimit: v })}
          />
          <RecentTasksPanel recentTasks={recentTasks} />
        </div>
      </div>
    </div>
  );
}
