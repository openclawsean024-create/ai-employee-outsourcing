/**
 * sub-components-tasknew.test.tsx
 * task-new 子元件 + TaskDetailModal 互動測試
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskInputPanel from '@/components/views/task-new/TaskInputPanel'
import SelectedAgentsPanel from '@/components/views/task-new/SelectedAgentsPanel'
import RecentTasksPanel from '@/components/views/task-new/RecentTasksPanel'
import AgentPickerFullView from '@/components/views/task-new/AgentPickerFullView'
import TaskDetailModal from '@/components/views/tasks/TaskDetailModal'
import type { AIAgent, TaskLog } from '@/lib/types'

function makeAgent(overrides: Partial<AIAgent> = {}): AIAgent {
  return {
    id: 'a001',
    name: '客服專員',
    displayName: '客服專員 Echo',
    category: 'customer_service',
    categoryLabel: '客服類',
    description: '回覆客戶詢問',
    systemPrompt: '你是客服專員',
    modelType: 'gpt-4o',
    isActive: true,
    ...overrides,
  } as AIAgent
}

describe('TaskInputPanel', () => {
  const baseProps = {
    taskName: '', setTaskName: () => {},
    input: '', setInput: () => {},
    running: false,
    selectedAgents: [makeAgent()],
    estimatedCost: 0.05,
    overLimit: false,
    acknowledgeOverLimit: false,
    setAcknowledgeOverLimit: () => {},
    onRun: () => {},
    setView: () => {},
    settings: { defaultCostLimit: 5, monthlyTaskUsed: 0 } as any,
  }

  it('有 input + 有 selectedAgent 時執行按鈕應可用', () => {
    render(<TaskInputPanel {...baseProps} input="test" />)
    const button = screen.getByText(/開始執行/)
    expect((button as HTMLButtonElement).disabled).toBe(false)
  })

  it('空 input 應禁用執行按鈕', () => {
    render(<TaskInputPanel {...baseProps} />)
    const button = screen.getByText(/開始執行/)
    expect((button as HTMLButtonElement).disabled).toBe(true)
  })

  it('overLimit 且未勾選確認時應禁用', () => {
    render(<TaskInputPanel {...baseProps} input="x" overLimit={true} />)
    const button = screen.getByText(/開始執行/)
    expect((button as HTMLButtonElement).disabled).toBe(true)
  })

  it('overLimit 但已勾選確認時應可用', () => {
    render(<TaskInputPanel {...baseProps} input="x" overLimit={true} acknowledgeOverLimit={true} />)
    const button = screen.getByText(/開始執行/)
    expect((button as HTMLButtonElement).disabled).toBe(false)
  })

  it('running 狀態應顯示「執行中...」', () => {
    render(<TaskInputPanel {...baseProps} input="x" running={true} />)
    expect(screen.getByText('執行中...')).toBeTruthy()
  })

  it('running 狀態下 textarea 應禁用', () => {
    render(<TaskInputPanel {...baseProps} input="x" running={true} />)
    const textarea = screen.getByPlaceholderText(/把要做的事情寫清楚/)
    expect((textarea as HTMLTextAreaElement).disabled).toBe(true)
  })

  it('overLimit 顯示時應有警告卡片', () => {
    render(<TaskInputPanel {...baseProps} overLimit={true} estimatedCost={10} />)
    expect(screen.getByText('預估成本超過單任務上限')).toBeTruthy()
  })

  it('input 變更應觸發 setInput', () => {
    let captured = ''
    render(<TaskInputPanel {...baseProps} setInput={(v) => { captured = v }} />)
    const textarea = screen.getByPlaceholderText(/把要做的事情寫清楚/)
    fireEvent.change(textarea, { target: { value: '新內容' } })
    expect(captured).toBe('新內容')
  })
})

describe('SelectedAgentsPanel', () => {
  it('無已選 agent 時顯示「尚未選任何 Agent」', () => {
    render(<SelectedAgentsPanel selectedAgents={[]} running={false} onToggle={() => {}} onShowAll={() => {}} />)
    expect(screen.getByText('尚未選任何 Agent')).toBeTruthy()
  })

  it('有已選 agent 時應顯示數量', () => {
    render(<SelectedAgentsPanel selectedAgents={[makeAgent(), makeAgent({id: 'a002', displayName: '測試 2'})]} running={false} onToggle={() => {}} onShowAll={() => {}} />)
    const countEl = screen.getByText('2')
    expect(countEl).toBeTruthy()
    expect(screen.getByText('客服專員 Echo')).toBeTruthy()
    expect(screen.getByText('測試 2')).toBeTruthy()
  })

  it('點擊 X 刪除應觸發 onToggle', () => {
    let captured = ''
    render(<SelectedAgentsPanel selectedAgents={[makeAgent()]} running={false} onToggle={(id) => { captured = id }} onShowAll={() => {}} />)
    // X button 是 disabled-enabled 的 button，class 含 text-ink-400
    const buttons = document.querySelectorAll('button')
    // 找 onClick 為 undefined (只有 form-action) 之外的 button
    const xBtn = Array.from(buttons).find(b =>
      b.className.includes('text-[var(--ink-400)]') &&
      b.querySelector('svg') // lucide icon
    ) as HTMLButtonElement
    expect(xBtn).toBeTruthy()
    xBtn.click()
    expect(captured).toBe('a001')
  })
})

describe('RecentTasksPanel', () => {
  it('無任務時不 render 任何內容', () => {
    const { container } = render(<RecentTasksPanel recentTasks={[]} />)
    expect(container.children.length).toBe(0)
  })

  it('有任務時顯示前 3 筆', () => {
    const tasks = [
      { id: 't1', taskName: '任務 A', status: 'success' as const } as TaskLog,
      { id: 't2', taskName: '任務 B', status: 'failed' as const } as TaskLog,
      { id: 't3', taskName: '任務 C', status: 'partial' as const } as TaskLog,
      { id: 't4', taskName: '任務 D (隱藏)', status: 'success' as const } as TaskLog,
    ]
    render(<RecentTasksPanel recentTasks={tasks} />)
    expect(screen.getByText('任務 A')).toBeTruthy()
    expect(screen.getByText('任務 B')).toBeTruthy()
    expect(screen.getByText('任務 C')).toBeTruthy()
    expect(screen.queryByText('任務 D (隱藏)')).toBeNull()
  })
})

describe('AgentPickerFullView', () => {
  it('selected agent 應有 ring 樣式', () => {
    const { container } = render(<AgentPickerFullView
      selectedIds={['a001']}
      onBack={() => {}}
      onToggle={() => {}}
    />)
    const ringed = container.querySelector('.ring-2')
    expect(ringed).toBeTruthy()
  })

  it('點擊 back 應觸發 onBack', () => {
    let called = false
    render(<AgentPickerFullView selectedIds={[]} onBack={() => { called = true }} onToggle={() => {}} />)
    fireEvent.click(screen.getByText(/返回任務建立/))
    expect(called).toBe(true)
  })
})

describe('TaskDetailModal', () => {
  it('task=null 時不 render 任何內容', () => {
    const { container } = render(<TaskDetailModal task={null} onClose={() => {}} />)
    expect(container.children.length).toBe(0)
  })

  it('有 task 時應顯示任務名稱與輸入', () => {
    const task = {
      id: 't1', taskName: '整理留言', input: '原始輸入',
      agentIds: [], agentNames: [], results: [],
      status: 'success', totalCost: 0.5, totalDurationMs: 2000,
      createdAt: new Date().toISOString(),
    } as TaskLog
    render(<TaskDetailModal task={task} onClose={() => {}} />)
    expect(screen.getByText('整理留言')).toBeTruthy()
    expect(screen.getByText('原始輸入')).toBeTruthy()
  })

  it('點擊背景 overlay 應觸發 onClose', () => {
    let called = false
    const task = {
      id: 't1', taskName: 'x', input: '',
      agentIds: [], agentNames: [], results: [],
      status: 'success', totalCost: 0, totalDurationMs: 0,
      createdAt: new Date().toISOString(),
    } as TaskLog
    const { container } = render(<TaskDetailModal task={task} onClose={() => { called = true }} />)
    const overlay = container.querySelector('.fixed.inset-0') as HTMLElement
    overlay.click()
    expect(called).toBe(true)
  })

  it('failed agent 結果應顯示 error 訊息', () => {
    const task = {
      id: 't1', taskName: 'x', input: '',
      agentIds: [], agentNames: ['A'],
      results: [{ agentId: 'a001', agentName: 'A', status: 'failed', output: '', durationMs: 0, costNTD: 0, error: 'API 錯誤' }],
      status: 'failed', totalCost: 0, totalDurationMs: 0,
      createdAt: new Date().toISOString(),
    } as TaskLog
    render(<TaskDetailModal task={task} onClose={() => {}} />)
    expect(screen.getByText('API 錯誤')).toBeTruthy()
  })

  it('success agent 結果應顯示 output', () => {
    const task = {
      id: 't1', taskName: 'x', input: '',
      agentIds: [], agentNames: ['A'],
      results: [{ agentId: 'a001', agentName: 'A', status: 'success', output: '完成回覆', durationMs: 100, costNTD: 0.01 }],
      status: 'success', totalCost: 0.01, totalDurationMs: 100,
      createdAt: new Date().toISOString(),
    } as TaskLog
    render(<TaskDetailModal task={task} onClose={() => {}} />)
    expect(screen.getByText('完成回覆')).toBeTruthy()
  })
})
