'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaskLog, TaskTemplate, UserSettings, View } from './types';
import { db } from './db';
import { runMultiAgentCollaboration } from './orchestrator';
import { getAgent } from './agents';

interface AIEOState {
  settings: UserSettings;
  currentView: View;
  isExecuting: boolean;
  executingTaskId: string | null;
  selectedAgentIds: string[];

  // Actions
  setView: (view: View) => void;
  toggleAgentSelection: (id: string) => void;
  clearAgentSelection: () => void;
  updateSettings: (updates: Partial<UserSettings>) => void;

  runTask: (input: string, taskName: string, templateId?: string) => Promise<TaskLog | null>;
  saveAsTemplate: (name: string, description: string, defaultInput: string) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  exportData: () => Promise<string>;
  importData: (json: string) => Promise<void>;
}

const DEFAULT_SETTINGS: UserSettings = {
  tier: 'pro',  // MVP 預設 Pro 讓所有 144 Agent 可用
  monthlyTaskLimit: 2000,
  monthlyTaskUsed: 0,
  defaultCostLimit: 5,
  workspaceName: '我的 AI 工作區',
};

export const useAIEOStore = create<AIEOState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      currentView: 'dashboard',
      isExecuting: false,
      executingTaskId: null,
      selectedAgentIds: [],

      setView: (view) => set({ currentView: view }),
      toggleAgentSelection: (id) => {
        const current = get().selectedAgentIds;
        set({
          selectedAgentIds: current.includes(id)
            ? current.filter(x => x !== id)
            : [...current, id],
        });
      },
      clearAgentSelection: () => set({ selectedAgentIds: [] }),

      updateSettings: (updates) => set({ settings: { ...get().settings, ...updates } }),

      runTask: async (input, taskName, templateId) => {
        const { selectedAgentIds, settings } = get();
        if (selectedAgentIds.length === 0) return null;

        // 檢查 tier 限制
        const limit = settings.tier === 'free' ? 5 : 144;
        if (selectedAgentIds.length > limit) {
          alert(`此方案最多支援 ${limit} 個 Agent 協作`);
          return null;
        }

        const agents = selectedAgentIds.map(id => getAgent(id)).filter(Boolean) as any[];
        const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        set({ isExecuting: true, executingTaskId: taskId });

        const startTime = Date.now();
        const results = await runMultiAgentCollaboration(agents, input);
        const totalDuration = Date.now() - startTime;

        const successCount = results.filter(r => r.status === 'success').length;
        const failCount = results.length - successCount;
        const status = failCount === 0 ? 'success' : failCount === results.length ? 'failed' : 'partial';

        let templateName: string | undefined;
        if (templateId) {
          const tmpl = await db.templates.get(templateId);
          templateName = tmpl?.name;
          if (tmpl) {
            await db.templates.update(templateId, { usageCount: tmpl.usageCount + 1 });
          }
        }

        const task: TaskLog = {
          id: taskId,
          taskName: taskName || '未命名任務',
          input,
          agentIds: selectedAgentIds,
          agentNames: agents.map(a => a.displayName),
          results,
          status,
          totalCost: results.reduce((s, r) => s + r.costNTD, 0),
          totalDurationMs: totalDuration,
          templateId,
          templateName,
          createdAt: new Date().toISOString(),
        };

        await db.tasks.add(task);
        set({
          isExecuting: false,
          executingTaskId: null,
          settings: { ...settings, monthlyTaskUsed: settings.monthlyTaskUsed + 1 },
        });

        return task;
      },

      saveAsTemplate: async (name, description, defaultInput) => {
        const { selectedAgentIds } = get();
        const template: TaskTemplate = {
          id: `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name,
          description,
          agentIds: selectedAgentIds,
          defaultInput,
          usageCount: 0,
          createdAt: new Date().toISOString(),
        };
        await db.templates.add(template);
      },

      deleteTemplate: async (id) => {
        await db.templates.delete(id);
      },

      exportData: async () => {
        const tasks = await db.tasks.toArray();
        const templates = await db.templates.toArray();
        return JSON.stringify({
          version: 1,
          exportedAt: new Date().toISOString(),
          settings: get().settings,
          tasks,
          templates,
        }, null, 2);
      },

      importData: async (json) => {
        const data = JSON.parse(json);
        if (data.tasks) await db.tasks.bulkPut(data.tasks);
        if (data.templates) await db.templates.bulkPut(data.templates);
        if (data.settings) set({ settings: data.settings });
      },
    }),
    {
      name: 'aieo-storage',
      version: 1,
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);