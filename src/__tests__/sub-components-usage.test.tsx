/**
 * P0 + P1 + P2 重構後的 sub-component 單元測試
 * Tier A: 純邏輯 / 純渲染 sub-components（無 useLiveQuery）
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import UsageHeader from '@/components/views/usage/UsageHeader'
import CategoryDistribution from '@/components/views/usage/CategoryDistribution'
import TopAgentsList from '@/components/views/usage/TopAgentsList'
import CostLimitPanel from '@/components/views/task-new/CostLimitPanel'
import DashboardHero from '@/components/views/dashboard/DashboardHero'
import { TaskNewHeader } from '@/components/views/task-new/AgentListToggle'

describe('UsageHeader', () => {
  it('應顯示用量報表標題', () => {
    render(<UsageHeader savedHours={12.5} />)
    expect(screen.getByText('用量報表')).toBeTruthy()
    expect(screen.getByText('你的 AI 團隊')).toBeTruthy()
  })

  it('應以 1 位小數顯示節省時間', () => {
    render(<UsageHeader savedHours={7.234} />)
    expect(screen.getByText(/7\.2 小時/)).toBeTruthy()
  })

  it('零小時也應正常 render（不會 crash）', () => {
    render(<UsageHeader savedHours={0} />)
    expect(screen.getByText(/0\.0 小時/)).toBeTruthy()
  })
})

describe('CategoryDistribution', () => {
  it('有資料時應列出類別與次數', () => {
    render(<CategoryDistribution topCategories={[
      ['客服類', 12],
      ['行銷類', 8],
      ['設計類', 5],
    ]} />)
    expect(screen.getByText('客服類')).toBeTruthy()
    expect(screen.getByText('12 次')).toBeTruthy()
    expect(screen.getByText('行銷類')).toBeTruthy()
    expect(screen.getByText('8 次')).toBeTruthy()
  })

  it('無資料時應顯示「尚無資料」', () => {
    render(<CategoryDistribution topCategories={[]} />)
    expect(screen.getByText('尚無資料')).toBeTruthy()
  })

  it('標題應包含「類別分布」與「10 大類」', () => {
    render(<CategoryDistribution topCategories={[]} />)
    expect(screen.getByText('類別分布')).toBeTruthy()
    expect(screen.getByText('10 大類')).toBeTruthy()
  })
})

describe('TopAgentsList', () => {
  it('應列出 top agent + 次數 + 對應 progress bar', () => {
    const { container } = render(<TopAgentsList
      topAgents={[['客服專員', 10], ['文案撰寫員', 5]]}
      maxAgentUse={10}
    />)
    expect(screen.getByText('客服專員')).toBeTruthy()
    expect(screen.getByText('10 次')).toBeTruthy()
    expect(screen.getByText('文案撰寫員')).toBeTruthy()
    expect(screen.getByText('5 次')).toBeTruthy()
    // progress bar 寬度
    const bars = container.querySelectorAll('[style*="width"]')
    expect(bars.length).toBeGreaterThan(0)
  })

  it('無資料時應顯示「尚無資料」', () => {
    render(<TopAgentsList topAgents={[]} maxAgentUse={1} />)
    expect(screen.getByText('尚無資料')).toBeTruthy()
  })
})

describe('TaskNewHeader', () => {
  it('應顯示頁面標題與描述', () => {
    render(<TaskNewHeader />)
    expect(screen.getByText('建立任務')).toBeTruthy()
    expect(screen.getByText('描述工作，3 秒開始')).toBeTruthy()
  })
})

describe('CostLimitPanel', () => {
  it('應顯示目前的上限值', () => {
    const settings = { defaultCostLimit: 5, monthlyTaskUsed: 0 } as any
    render(<CostLimitPanel settings={settings} onChange={() => {}} />)
    expect(screen.getByText('NT$5')).toBeTruthy()
  })

  it('「超過會要求確認」提示應顯示', () => {
    const settings = { defaultCostLimit: 10, monthlyTaskUsed: 0 } as any
    render(<CostLimitPanel settings={settings} onChange={() => {}} />)
    expect(screen.getByText('超過會要求確認')).toBeTruthy()
  })
})

describe('DashboardHero', () => {
  it('應顯示 144 種 Agent 標題', () => {
    render(<DashboardHero onNavigate={() => {}} />)
    expect(screen.getByText(/144 種 AI Agent/)).toBeTruthy()
  })

  it('點擊「開始使用」應呼叫 onNavigate("task_new")', () => {
    let navigated = ''
    render(<DashboardHero onNavigate={(v) => { navigated = v }} />)
    screen.getByText('開始使用').click()
    expect(navigated).toBe('task_new')
  })

  it('點擊「瀏覽 144 種 Agent」應呼叫 onNavigate("agents")', () => {
    let navigated = ''
    render(<DashboardHero onNavigate={(v) => { navigated = v }} />)
    screen.getByText('瀏覽 144 種 Agent').click()
    expect(navigated).toBe('agents')
  })
})
