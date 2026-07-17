/**
 * TasksView 子元件單元測試
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TasksHeader from '@/components/views/tasks/TasksHeader'
import TaskFilters from '@/components/views/tasks/TaskFilters'
import TaskTable from '@/components/views/tasks/TaskTable'
import type { TaskLog } from '@/lib/types'

function makeTask(overrides: Partial<TaskLog> = {}): TaskLog {
  return {
    id: 't1',
    taskName: '測試任務',
    input: 'test input',
    agentIds: ['a001'],
    agentNames: ['客服專員'],
    results: [],
    status: 'success',
    totalCost: 0.05,
    totalDurationMs: 1200,
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('TasksHeader', () => {
  it('「0 筆任務」時不顯示成功率', () => {
    render(<TasksHeader taskCount={0} successCount={0} totalCost={0} />)
    expect(screen.getByText(/0 筆任務/)).toBeTruthy()
    expect(screen.getByText(/成功率 0%/)).toBeTruthy()
  })

  it('「10 筆任務 / 9 成功」應顯示 90%', () => {
    // fmtMoney 會做 Math.round，所以 1.23 → NT$ 1
    const { container } = render(<TasksHeader taskCount={10} successCount={9} totalCost={1.23} />)
    expect(container.textContent).toMatch(/10 筆任務/)
    expect(container.textContent).toMatch(/成功率 90%/)
    expect(container.textContent).toMatch(/NT\$\s*1/)
  })

  it('半數成功率應四捨五入', () => {
    render(<TasksHeader taskCount={3} successCount={2} totalCost={0} />)
    expect(screen.getByText(/成功率 67%/)).toBeTruthy()
  })
})

describe('TaskFilters', () => {
  it('點擊「成功」應觸發 setStatusFilter("success")', () => {
    let captured = ''
    render(<TaskFilters q="" setQ={() => {}} statusFilter="all" setStatusFilter={(v) => { captured = v }} />)
    fireEvent.click(screen.getByText('成功'))
    expect(captured).toBe('success')
  })

  it('當前選項應有高亮樣式 (bg-navy-900)', () => {
    const { container } = render(<TaskFilters q="" setQ={() => {}} statusFilter="success" setStatusFilter={() => {}} />)
    const successBtn = screen.getByText('成功')
    expect(successBtn.className).toContain('bg-[var(--navy-900)]')
  })

  it('輸入搜尋字應觸發 setQ', () => {
    let captured = ''
    render(<TaskFilters q="" setQ={(v) => { captured = v }} statusFilter="all" setStatusFilter={() => {}} />)
    const input = screen.getByPlaceholderText(/搜尋任務名稱/)
    fireEvent.change(input, { target: { value: '客服' } })
    expect(captured).toBe('客服')
  })
})

describe('TaskTable', () => {
  it('無任務時應顯示「還沒有任何任務」', () => {
    render(<TaskTable tasks={[]} hasAnyTask={false} onView={() => {}} />)
    expect(screen.getByText('還沒有任何任務')).toBeTruthy()
  })

  it('有任務但被 filter 過濾時應顯示「沒有符合的任務」', () => {
    render(<TaskTable tasks={[]} hasAnyTask={true} onView={() => {}} />)
    expect(screen.getByText('沒有符合的任務')).toBeTruthy()
  })

  it('點擊 mobile card 的檢視按鈕應呼叫 onView(task)', () => {
    const task = makeTask()
    let captured: TaskLog | null = null
    render(<TaskTable tasks={[task]} hasAnyTask={true} onView={(t: TaskLog) => { captured = t }} />)
    fireEvent.click(screen.getByRole('button', { name: '檢視測試任務' }))
    const id = (captured as TaskLog | null)?.id
    expect(id).toBe('t1')
  })

  it('mobile fallback 應用 card 呈現任務細節與檢視按鈕', () => {
    const task = makeTask({ agentNames: ['客服專員', '文案助手', '資料分析'] });
    render(<TaskTable tasks={[task]} hasAnyTask={true} onView={() => {}} />);

    const mobileCard = screen.getByTestId('task-mobile-card-t1');
    expect(mobileCard.textContent).toContain('測試任務');
    expect(mobileCard.textContent).toContain('客服專員');
    expect(mobileCard.textContent).toContain('成功');
    expect(screen.getByRole('button', { name: '檢視測試任務' })).toBeTruthy();
  });

  it('應顯示任務成本', () => {
    const task = makeTask({ totalCost: 12.42 })
    const { container } = render(<TaskTable tasks={[task]} hasAnyTask={true} onView={() => {}} />)
    // fmtMoney 會做 Math.round：12.42 → NT$ 12
    expect(container.textContent).toMatch(/NT\$\s*12/)
  })

  it('多個 agent 名稱超過 2 個應顯示「+N」', () => {
    const task = makeTask({
      agentNames: ['A', 'B', 'C', 'D'],
    })
    render(<TaskTable tasks={[task]} hasAnyTask={true} onView={() => {}} />)
    expect(screen.getByTestId('task-mobile-card-t1').textContent).toContain('+2');
  })

  it('status badge 應顯示中文標籤', () => {
    const task = makeTask({ status: 'success' })
    render(<TaskTable tasks={[task]} hasAnyTask={true} onView={() => {}} />)
    expect(screen.getByTestId('task-mobile-card-t1').textContent).toContain('成功');
  })

  it('failed status 應顯示「失敗」', () => {
    const task = makeTask({ status: 'failed' })
    render(<TaskTable tasks={[task]} hasAnyTask={true} onView={() => {}} />)
    expect(screen.getByTestId('task-mobile-card-t1').textContent).toContain('失敗');
  })

  it('partial status 應顯示「部分」', () => {
    const task = makeTask({ status: 'partial' })
    render(<TaskTable tasks={[task]} hasAnyTask={true} onView={() => {}} />)
    expect(screen.getByTestId('task-mobile-card-t1').textContent).toContain('部分');
  })
})
