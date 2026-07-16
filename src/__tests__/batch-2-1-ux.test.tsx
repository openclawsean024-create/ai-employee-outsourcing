import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import TaskInputPanel from '@/components/views/task-new/TaskInputPanel';
import AgentsFiltersBar from '@/components/views/agents/AgentsFiltersBar';
import type { AIAgent } from '@/lib/types';

const agent: AIAgent = {
  id: 'agent-1',
  name: '客服專員',
  displayName: '客服專員',
  category: 'customer_service',
  categoryLabel: '客服類',
  description: '處理客戶問題',
  systemPrompt: '你是客服專員',
  modelType: 'gpt-4o',
  isActive: true,
};

const taskProps = {
  taskName: '',
  setTaskName: () => {},
  input: '測試任務',
  setInput: () => {},
  running: false,
  selectedAgents: [agent],
  estimatedCost: 10,
  overLimit: true,
  acknowledgeOverLimit: false,
  setAcknowledgeOverLimit: () => {},
  onRun: () => {},
  setView: () => {},
  settings: { defaultCostLimit: 5, monthlyTaskUsed: 0 } as any,
};

describe('Batch 2.1 UX-1 and UX-3', () => {
  it('cost warning consumes the semantic warning surface token', () => {
    render(<TaskInputPanel {...taskProps} />);

    expect(screen.getByTestId('cost-warning').className).toContain('bg-[var(--warning-soft)]');
    expect(screen.getByTestId('cost-warning').className).not.toContain('#FEF3C7');
  });

  it('Agent filter row keeps the mobile container padding while remaining scrollable', () => {
    render(
      <AgentsFiltersBar
        search=""
        setSearch={() => {}}
        activeCategory="all"
        setActiveCategory={() => {}}
        selectedCount={0}
        setView={() => {}}
      />,
    );

    const filterBar = screen.getByTestId('agents-filter-bar');
    const filterRow = screen.getByTestId('agents-filter-row');

    expect(filterBar.className).toContain('px-6');
    expect(filterBar.className).toContain('md:px-10');
    expect(filterRow.className).toContain('overflow-x-auto');
    expect(filterRow.className).toContain('px-6');
    expect(filterRow.className).toContain('md:px-0');
  });
});
